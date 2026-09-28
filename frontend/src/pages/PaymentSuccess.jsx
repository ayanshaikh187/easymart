import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/home/Footer";
import { useCart } from "../context/CartContext";
import { confirmPayment } from "../services/orderService";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { clearCart } = useCart();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");

  // React StrictMode runs effects twice in dev; only confirm once
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!sessionId) {
      setStatus("error");
      setMessage("Missing payment session.");
      return;
    }

    // Creates the order if the webhook has not done it yet (safe to repeat)
    confirmPayment(sessionId)
      .then((data) => {
        setOrder(data.order);
        setStatus("success");
        clearCart(true);
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error.message);
      });
  }, [sessionId, clearCart]);

  return (
    <>
      <Navbar />

      <section className="max-w-2xl mx-auto px-6 py-40 text-center">
        {status === "loading" && (
          <h1 className="text-3xl font-bold">Confirming your payment...</h1>
        )}

        {status === "success" && (
          <>
            <div className="text-7xl">🎉</div>

            <h1 className="text-4xl font-bold mt-6 text-green-600">
              Payment Successful!
            </h1>

            <p className="text-gray-600 mt-4">
              Thank you for your order.
              {order && ` Total paid: $${order.totalPrice.toFixed(2)}`}
            </p>

            <div className="flex gap-4 justify-center mt-10">
              <Link
                to="/orders"
                className="bg-green-600 text-white px-8 py-3 rounded-full"
              >
                View My Orders
              </Link>

              <Link
                to="/shop"
                className="border border-green-600 text-green-600 px-8 py-3 rounded-full"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-3xl font-bold text-red-500">
              We could not confirm your payment
            </h1>

            <p className="text-gray-600 mt-4">{message}</p>

            <p className="text-gray-500 mt-2">
              If money was deducted, your order will still appear in My Orders.
            </p>

            <Link
              to="/orders"
              className="inline-block mt-8 bg-green-600 text-white px-8 py-3 rounded-full"
            >
              Check My Orders
            </Link>
          </>
        )}
      </section>

      <Footer />
    </>
  );
}

export default PaymentSuccess;
