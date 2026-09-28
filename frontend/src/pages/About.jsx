import {
  FaLeaf,
  FaTruck,
  FaUsers,
  FaAward,
} from "react-icons/fa";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/home/Footer";

function About() {
  const features = [
    {
      icon: <FaLeaf />,
      title: "100% Organic",
      desc: "Fresh and healthy products directly from farms.",
    },
    {
      icon: <FaTruck />,
      title: "Fast Delivery",
      desc: "Quick delivery right to your doorstep.",
    },
    {
      icon: <FaUsers />,
      title: "Happy Customers",
      desc: "Trusted by thousands of satisfied customers.",
    },
    {
      icon: <FaAward />,
      title: "Best Quality",
      desc: "Premium quality products at affordable prices.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero */}

      <section className="bg-[#EAF8EC] text-green-600 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold">
            About EasyMart
          </h1>

          <p className="mt-6 text-lg max-w-3xl mx-auto text-green-100">
            EasyMart brings fresh groceries directly from farms to your home.
            We focus on quality, affordability and fast delivery.
          </p>
        </div>
      </section>

      {/* Story */}

      <section className="max-w-7xl mx-auto py-20 px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900"
            className="rounded-3xl shadow-xl"
            alt=""
          />

          <div>

            <span className="text-green-600 font-bold uppercase">
              Our Story
            </span>

            <h2 className="text-5xl font-bold mt-4">
              Fresh Grocery
              <br />
              Every Single Day
            </h2>

            <p className="text-gray-600 mt-6 leading-8">
              Our mission is to deliver premium quality fruits,
              vegetables, dairy and bakery products directly from trusted
              farms to every household.
            </p>

            <button className="mt-8 bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 duration-300">
              Shop Now
            </button>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="bg-gray-50 py-20">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center">
            Why Choose Us
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">

            {features.map((item, index) => (

              <div
                key={index}
                className="bg-white rounded-3xl shadow-lg p-8 text-center hover:-translate-y-2 duration-300"
              >

                <div className="text-5xl text-green-600 flex justify-center">
                  {item.icon}
                </div>

                <h3 className="text-2xl font-bold mt-6">
                  {item.title}
                </h3>

                <p className="text-gray-500 mt-4">
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default About;