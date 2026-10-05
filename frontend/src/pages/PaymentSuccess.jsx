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

  const [status, setStatus] = useState("loading");
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");

  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;

    started.current = true;

    if (!sessionId) {
      setStatus("error");
      setMessage("Payment session is missing.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const data = await confirmPayment(sessionId);

        setOrder(data.order);
        setStatus("success");

        clearCart(true);
      } catch (error) {
        console.error("Payment confirmation error:", error);

        setStatus("error");

        setMessage(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to confirm your payment."
        );
      }
    };

    verifyPayment();
  }, [sessionId, clearCart]);

  return (
    <>
      <Navbar />

      <main className="min-h-[70vh] flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-2xl text-center">

          {/* Loading */}
          {status === "loading" && (
            <div className="rounded-3xl bg-white p-10 shadow-xl">
              <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />

              <h1 className="text-3xl font-bold text-gray-900">
                Confirming Your Payment...
              </h1>

              <p className="mt-4 text-gray-600">
                Please wait while we confirm your payment.
              </p>
            </div>
          )}

          {/* Success */}
          {status === "success" && (
            <div className="rounded-3xl bg-white p-10 shadow-xl">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-5xl text-green-600">
                ✓
              </div>

              <h1 className="mt-7 text-4xl font-extrabold text-green-600">
                Payment Successful!
              </h1>

              <p className="mt-4 text-lg text-gray-600">
                Thank you for your order. Your payment has been confirmed
                successfully.
              </p>

              {order && (
                <div className="mt-8 rounded-2xl bg-gray-50 p-6 text-left">
                  <div className="flex justify-between border-b pb-4">
                    <span className="font-medium text-gray-600">
                      Order ID
                    </span>

                    <span className="font-semibold text-gray-900">
                      #{order._id?.slice(-8)}
                    </span>
                  </div>

                  <div className="flex justify-between pt-4">
                    <span className="font-medium text-gray-600">
                      Total Paid
                    </span>

                    <span className="font-bold text-green-600">
                      ${Number(order.totalPrice || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  to="/orders"
                  className="rounded-full bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  View My Orders
                </Link>

                <Link
                  to="/shop"
                  className="rounded-full border-2 border-green-600 px-8 py-3 font-semibold text-green-600 transition hover:bg-green-50"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="rounded-3xl bg-white p-10 shadow-xl">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-5xl text-red-500">
                !
              </div>

              <h1 className="mt-7 text-3xl font-extrabold text-red-500">
                Payment Confirmation Failed
              </h1>

              <p className="mt-4 text-gray-600">
                {message}
              </p>

              <p className="mt-3 text-sm text-gray-500">
                If your money was deducted, please check your orders before
                trying to pay again.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  to="/orders"
                  className="rounded-full bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  Check My Orders
                </Link>

                <Link
                  to="/shop"
                  className="rounded-full border-2 border-gray-300 px-8 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Back to Shop
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default PaymentSuccess;
