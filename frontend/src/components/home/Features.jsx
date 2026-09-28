import { FaTruck, FaLeaf, FaCreditCard, FaHeadset } from "react-icons/fa";

const features = [
  {
    id: 1,
    icon: <FaTruck />,
    title: "Free Shipping",
    desc: "Orders over $100",
  },
  {
    id: 2,
    icon: <FaLeaf />,
    title: "100% Organic",
    desc: "Fresh Every Day",
  },
  {
    id: 3,
    icon: <FaCreditCard />,
    title: "Secure Payment",
    desc: "100% Protected",
  },
  {
    id: 4,
    icon: <FaHeadset />,
    title: "24/7 Support",
    desc: "Anytime Help",
  },
];

function Features() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-6 rounded-2xl shadow hover:shadow-lg duration-300"
          >
            <div className="text-3xl text-green-600">{item.icon}</div>

            <div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;