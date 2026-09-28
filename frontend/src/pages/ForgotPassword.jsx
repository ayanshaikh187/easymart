import { useState } from "react";
import { toast } from "react-toastify";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import apiRequest from "../utils/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      toast.success("If that email exists, a reset link has been sent.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">

          {/* Header */}
          <div className="text-center mb-8">

            <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <FaEnvelope className="text-green-600 text-xl" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Forgot Password?
            </h1>

            <p className="text-gray-500 mt-2">
              Enter your email and we'll help you reset your password.
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-5">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-green-200 transition-all"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

          </form>

          <Link
            to="/login"
            className="mt-7 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-green-600 transition"
          >
            <FaArrowLeft />
            Back to Login
          </Link>

        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;

