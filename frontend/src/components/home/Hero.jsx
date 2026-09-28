import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-[#EAF8EC]">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">

        <div className="grid lg:grid-cols-2 items-center gap-12">

          {/* Left Side */}
          <div>

            <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm">
              100% Organic Grocery
            </span>

            <h1 className="mt-6 text-5xl lg:text-7xl font-extrabold leading-tight text-gray-900">
              Fresh Grocery
              <br />
              Delivered
              <span className="text-green-600"> To Your Door</span>
            </h1>

            <p className="mt-6 text-gray-600 text-lg max-w-lg">
              Discover fresh vegetables, fruits and daily essentials at
              unbeatable prices with fast delivery.
            </p>

            <div className="mt-8 flex gap-5">
              <Link to="/shop" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold duration-300">
                <button>
                Shop Now
                </button>
              </Link>

              <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-full font-semibold duration-300">
                Explore
              </button>
            </div>

          </div>

          {/* Right Side */}

          <div className="relative">

            <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-200 rounded-full blur-3xl opacity-50"></div>

            <div className="absolute bottom-0 right-0 w-56 h-56 bg-green-300 rounded-full blur-3xl opacity-40"></div>

            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900"
              alt="Fresh Grocery"
              className="relative z-10 w-full"
            />

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;