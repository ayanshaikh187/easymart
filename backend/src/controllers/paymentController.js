const stripe = require("../config/stripe");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { calculatePricing } = require("../utils/pricing");

const CLIENT_URL = () => process.env.CLIENT_URL || "http://localhost:5173";
const CURRENCY = () => (process.env.STRIPE_CURRENCY || "usd").toLowerCase();

// Stripe uses the smallest currency unit (cents)
const toCents = (amount) => Math.round(amount * 100);

// ==========================================
// CREATE STRIPE CHECKOUT SESSION
// ==========================================

const createCheckoutSession = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      address,
      city,
      postalCode,
      shippingMethod,
      coupon,
    } = req.body;

    if (!fullName || !phone || !address || !city) {
      return res.status(400).json({
        success: false,
        message: "Please provide full name, phone, address and city",
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    let subtotal = 0;

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "One of the products no longer exists",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}`,
        });
      }

      subtotal += product.price * item.quantity;
    }

    // Shipping / tax / coupon are calculated on the SERVER
    const pricing = calculatePricing(subtotal, shippingMethod, coupon);
    const currency = CURRENCY();

    // ----- Product line items -----
    const lineItems = cart.items.map((item) => {
      const product = item.product;

      return {
        price_data: {
          currency,
          product_data: {
            name: product.name,
            ...(product.description && {
              description: product.description.slice(0, 500),
            }),
            ...(product.image && /^https?:\/\//.test(product.image)
              ? { images: [product.image] }
              : {}),
            // used later to build the order from what was actually paid
            metadata: { productId: product._id.toString() },
          },
          unit_amount: toCents(product.price),
        },
        quantity: item.quantity,
      };
    });

    // ----- Shipping & tax as extra line items (no productId) -----
    if (pricing.shippingPrice > 0) {
      lineItems.push({
        price_data: {
          currency,
          product_data: { name: "Shipping" },
          unit_amount: toCents(pricing.shippingPrice),
        },
        quantity: 1,
      });
    }

    if (pricing.taxPrice > 0) {
      lineItems.push({
        price_data: {
          currency,
          product_data: { name: "Tax (5%)" },
          unit_amount: toCents(pricing.taxPrice),
        },
        quantity: 1,
      });
    }

    // ----- Coupon (fixed amount off) -----
    const discounts = [];

    if (pricing.discount > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: toCents(pricing.discount),
        currency,
        duration: "once",
        name: String(coupon).toUpperCase(),
      });

      discounts.push({ coupon: stripeCoupon.id });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      ...(discounts.length && { discounts }),
      customer_email: req.user.email,

      success_url: `${CLIENT_URL()}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL()}/payment-cancelled`,

      metadata: {
        userId: req.user._id.toString(),
        fullName,
        phone,
        address,
        city,
        postalCode: postalCode || "",
        shippingPrice: String(pricing.shippingPrice),
        taxPrice: String(pricing.taxPrice),
        discount: String(pricing.discount),
      },
    });

    res.status(200).json({
      success: true,
      message: "Checkout session created",
      sessionId: session.id,
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
      error: error.message,
    });
  }
};

// ==========================================
// FULFILL ORDER (shared by webhook + confirm)
// Safe to call many times for the same session.
// ==========================================

const fulfillOrder = async (session) => {
  if (session.payment_status !== "paid") {
    return null;
  }

  // Already processed?
  const existing = await Order.findOne({ stripeSessionId: session.id });

  if (existing) return existing;

  const meta = session.metadata || {};

  if (!meta.userId) {
    throw new Error("Missing userId in Stripe metadata");
  }

  // What the customer ACTUALLY paid for
  const lines = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
    expand: ["data.price.product"],
  });

  const paidItems = lines.data
    .filter((line) => line.price?.product?.metadata?.productId)
    .map((line) => ({
      productId: line.price.product.metadata.productId,
      quantity: line.quantity,
      price: line.price.unit_amount / 100,
      name: line.description,
    }));

  if (paidItems.length === 0) {
    throw new Error("No products found in Stripe session");
  }

  // Images come from our DB
  const products = await Product.find({
    _id: { $in: paidItems.map((i) => i.productId) },
  }).select("image");

  const imageById = {};
  products.forEach((p) => {
    imageById[p._id.toString()] = p.image;
  });

  let order;

  try {
    order = await Order.create({
      user: meta.userId,

      items: paidItems.map((i) => ({
        product: i.productId,
        name: i.name,
        image: imageById[i.productId] || "",
        price: i.price,
        quantity: i.quantity,
      })),

      shippingAddress: {
        fullName: meta.fullName,
        phone: meta.phone,
        address: meta.address,
        city: meta.city,
        postalCode: meta.postalCode || "",
      },

      shippingPrice: Number(meta.shippingPrice) || 0,
      taxPrice: Number(meta.taxPrice) || 0,
      discount: Number(meta.discount) || 0,
      totalPrice: session.amount_total / 100,

      paymentMethod: "stripe",
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent || "",
      paymentStatus: "paid",
      orderStatus: "processing",
    });
  } catch (error) {
    // Duplicate key => webhook and confirm raced; the other one won.
    if (error.code === 11000) {
      return Order.findOne({ stripeSessionId: session.id });
    }

    throw error;
  }

  // Reduce stock (payment already taken, so never fail the order here)
  for (const item of paidItems) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.productId, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }
    );

    if (!updated) {
      console.warn(
        `Stock too low for product ${item.productId} on paid order ${order._id} - check manually`
      );
    }
  }

  // Empty the user's cart
  await Cart.findOneAndUpdate({ user: meta.userId }, { items: [] });

  console.log("Order created from Stripe payment:", order._id.toString());

  return order;
};

// ==========================================
// CONFIRM PAYMENT (called by the success page)
// Works even if the webhook is not running (local dev).
// ==========================================

const confirmPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // A user may only confirm their own payment
    if (session.metadata?.userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "This payment does not belong to you",
      });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    const order = await fulfillOrder(session);

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Confirm payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to confirm payment",
      error: error.message,
    });
  }
};

// ==========================================
// STRIPE WEBHOOK
// ==========================================

const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw Buffer (see server.js)
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  console.log("Stripe Event:", event.type);

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    try {
      await fulfillOrder(event.data.object);
    } catch (error) {
      console.error("Webhook order processing error:", error);

      // 500 => Stripe will retry later
      return res.status(500).json({
        success: false,
        message: "Failed to process payment",
      });
    }
  }

  res.status(200).json({ received: true });
};

module.exports = {
  createCheckoutSession,
  confirmPayment,
  stripeWebhook,
};
