const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { calculatePricing } = require("../utils/pricing");

// ===============================
// CREATE ORDER (Cash on Delivery)
// Stripe orders are created by paymentController after payment succeeds.
// ===============================
const createOrder = async (req, res) => {
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
    const orderItems = [];

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

      // Price ALWAYS comes from the database, never from the frontend
      subtotal += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const pricing = calculatePricing(subtotal, shippingMethod, coupon);

    // Reduce stock atomically (fails if someone else bought it meanwhile)
    const reduced = [];

    for (const item of cart.items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );

      if (!updated) {
        // rollback what we already reduced
        for (const r of reduced) {
          await Product.findByIdAndUpdate(r.id, { $inc: { stock: r.qty } });
        }

        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${item.product.name}`,
        });
      }

      reduced.push({ id: item.product._id, qty: item.quantity });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: { fullName, phone, address, city, postalCode },
      shippingPrice: pricing.shippingPrice,
      taxPrice: pricing.taxPrice,
      discount: pricing.discount,
      totalPrice: pricing.total,
      paymentMethod: "cod",
      paymentStatus: "pending",
      orderStatus: "processing",
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// ===============================
// GET MY ORDERS
// ===============================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// ===============================
// GET ORDER BY ID (owner or admin)
// ===============================
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const isOwner = order.user.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not allowed to view this order",
      });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// ===============================
// ADMIN: GET ALL ORDERS
// ===============================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// ===============================
// ADMIN: UPDATE ORDER STATUS
// ===============================
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const allowed = ["processing", "shipped", "delivered", "cancelled"];

    if (!allowed.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `orderStatus must be one of: ${allowed.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;

    // COD is collected on delivery
    if (orderStatus === "delivered" && order.paymentMethod === "cod") {
      order.paymentStatus = "paid";
    }

    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
