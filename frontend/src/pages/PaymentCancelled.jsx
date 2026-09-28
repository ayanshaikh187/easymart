import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/home/Footer";

function PaymentCancelled() {
  return (
    <>
      <Navbar />

      <section className="max-w-2xl mx-auto px-6 py-40 text-center">
        <div className="text-7xl">😕</div>

        <h1 className="text-4xl font-bold mt-6">Payment Cancelled</h1>

        <p className="text-gray-600 mt-4">
          No money was charged. Your cart is still saved.
        </p>

        <div className="flex gap-4 justify-center mt-10">
          <Link
            to="/checkout"
            className="bg-green-600 text-white px-8 py-3 rounded-full"
          >
            Try Again
          </Link>

          <Link
            to="/cart"
            className="border border-green-600 text-green-600 px-8 py-3 rounded-full"
          >
            Back to Cart
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default PaymentCancelled;
