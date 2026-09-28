import React from "react";
import { Link } from "react-router-dom";

function OfferBanner() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="bg-green-600 rounded-[40px] overflow-hidden">

          <div className="grid lg:grid-cols-2 items-center">

            <div className="p-12">

              <span className="text-green-100 font-semibold">
                Limited Time Offer
              </span>

              <h2 className="text-white text-5xl font-bold mt-4">
                Get 50% Off
              </h2>

              <p className="text-green-100 mt-5 text-lg">
                Buy fresh groceries directly from our organic farms.
              </p>
              <Link to="/shop">
              <button className="mt-8 bg-white text-green-600 px-8 py-4 rounded-full font-semibold hover:scale-105 duration-300">
                Shop Now
              </button>
              </Link>

            </div>

            <div>

              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900"
                alt=""
                className="w-full h-full object-cover"
              />

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default OfferBanner;