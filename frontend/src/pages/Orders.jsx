import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/home/Footer";
import { getMyOrders } from "../services/orderService";

const badge = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyOrders()
      .then((data) => setOrders(data.orders || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-32 min-h-screen">
        <h1 className="text-5xl font-bold mb-10">My Orders</h1>

        {loading && <p className="text-gray-500">Loading orders...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-semibold">No orders yet</h2>

            <Link
              to="/shop"
              className="inline-block mt-6 bg-green-600 text-white px-8 py-3 rounded-full"
            >
              Start Shopping
            </Link>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow rounded-2xl p-6">
              <div className="flex flex-wrap justify-between gap-3 border-b pb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${badge[order.paymentStatus]}`}
                  >
                    {order.paymentMethod === "cod" ? "COD · " : "Card · "}
                    {order.paymentStatus}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${badge[order.orderStatus]}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={`${order._id}-${item.product}`}
                    className="flex items-center gap-4"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    )}

                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>

                      <p className="text-sm text-gray-500">
                        {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <p className="font-semibold">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-5 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Ship to: {order.shippingAddress.fullName},{" "}
                  {order.shippingAddress.address}, {order.shippingAddress.city}
                </p>

                <p className="text-xl font-bold text-green-600">
                  ${order.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Orders;
