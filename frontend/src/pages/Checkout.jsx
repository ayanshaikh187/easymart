import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/home/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { validatePhone } from "../utils/validators";
import {
  syncCartToServer,
  createStripeSession,
  createCodOrder,
} from "../services/orderService";

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    cart,
    subtotal,
    shipping,
    tax,
    discount,
    coupon,
    total,
    shippingMethod,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!form.fullName.trim() || !form.address.trim() || !form.city.trim()) {
      toast.error("Please fill name, address and city");
      return;
    }

    if (!validatePhone(form.phone)) {
      toast.error("Enter a valid phone number");
      return;
    }

    setLoading(true);

    try {
      // 1) copy browser cart -> server cart (server recalculates all prices)
      await syncCartToServer(cart);

      const payload = { ...form, shippingMethod, coupon };

      if (paymentMethod === "stripe") {
        // 2a) card payment -> redirect to Stripe hosted page
        const data = await createStripeSession(payload);

        window.location.href = data.checkoutUrl;
        return;
      }

      // 2b) cash on delivery -> order is created immediately
      await createCodOrder(payload);

      clearCart(true);
      toast.success("🎉 Order placed successfully");
      navigate("/orders");
    } catch (error) {
      toast.error(error.message || "Could not place order");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />

        <section className="max-w-3xl mx-auto px-6 py-40 text-center">
          <h1 className="text-4xl font-bold">Your cart is empty</h1>

          <Link
            to="/shop"
            className="inline-block mt-8 bg-green-600 text-white px-8 py-3 rounded-full"
          >
            Go to Shop
          </Link>
        </section>

        <Footer />
      </>
    );
  }

  const inputClass = "w-full border p-3 rounded-lg mb-4";

  return (
    <>
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-32">
        <h1 className="text-5xl font-bold mb-10">Checkout</h1>

        <form onSubmit={placeOrder} className="grid lg:grid-cols-2 gap-10">
          {/* Billing Form */}
          <div className="bg-white shadow rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6">Shipping Details</h2>

            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              type="text"
              placeholder="Full Name"
              className={inputClass}
            />

            <input
              type="email"
              value={user?.email || ""}
              disabled
              className={`${inputClass} bg-gray-100 text-gray-500`}
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              type="text"
              placeholder="Phone Number"
              className={inputClass}
            />

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              rows="3"
              className={inputClass}
            ></textarea>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                type="text"
                placeholder="City"
                className={inputClass}
              />

              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                type="text"
                placeholder="Postal Code (optional)"
                className={inputClass}
              />
            </div>

            <h3 className="text-xl font-bold mt-4 mb-3">Payment Method</h3>

            <label className="flex items-center gap-3 border rounded-lg p-4 mb-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "stripe"}
                onChange={() => setPaymentMethod("stripe")}
              />
              Pay online by Card (Stripe)
            </label>

            <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery
            </label>
          </div>

          {/* Order Summary */}
          <div className="bg-white shadow rounded-2xl p-8 h-fit">
            <h2 className="text-3xl font-bold mb-6">Order Summary</h2>

            {cart.map((item) => (
              <div key={item.id} className="flex justify-between mb-4">
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <hr className="my-5" />

            <div className="flex justify-between mb-3">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>Shipping ({shippingMethod})</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between mb-3 text-green-600">
                <span>Discount ({coupon})</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <hr className="my-5" />

            <div className="flex justify-between text-2xl font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-xl"
            >
              {loading
                ? "Please wait..."
                : paymentMethod === "stripe"
                  ? "Pay with Card"
                  : "Place Order"}
            </button>

            <Link
              to="/cart"
              className="block text-center mt-4 text-gray-500 hover:text-green-600"
            >
              ← Back to cart
            </Link>
          </div>
        </form>
      </section>

      <Footer />
    </>
  );
}

export default Checkout;
