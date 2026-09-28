import { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/home/Footer";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        "service_iqq6al9",
        "template_abr47tp",
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        "Bn-c0oJgPJIMSlQ_V"
      );

      toast.success("Message sent successfully! 🎉");

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#EAF8EC] text-green-600 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold">
            Contact Us
          </h1>

          <p className="mt-5 text-green-700">
            We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* Left */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Get In Touch
            </h2>

            <p className="text-gray-500 mt-5 leading-8">
              Feel free to contact us anytime.
              Our support team is available 24/7.
            </p>

            <div className="space-y-6 mt-10">

              {/* Address */}
              <div className="flex items-center gap-5">
                <div className="bg-green-600 text-white p-4 rounded-full">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Address
                  </h3>

                  <p className="text-gray-500">
                    Karachi, Pakistan
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-5">
                <div className="bg-green-600 text-white p-4 rounded-full">
                  <FaPhoneAlt />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Phone
                  </h3>

                  <p className="text-gray-500">
                    +92 300 1234567
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-5">
                <div className="bg-green-600 text-white p-4 rounded-full">
                  <FaEnvelope />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Email
                  </h3>

                  <p className="text-gray-500">
                    support@easymart.com
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 border border-gray-100">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              Send Message
            </h2>

            <form onSubmit={handleSubmit}>

              {/* Name */}
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-200 p-4 rounded-xl mb-5 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
              />

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-200 p-4 rounded-xl mb-5 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
              />

              {/* Message */}
              <textarea
                name="message"
                rows="6"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-200 p-4 rounded-xl outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition resize-none"
              />

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-4 rounded-xl text-lg font-semibold transition-all shadow-lg shadow-green-200"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

            </form>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default Contact;

