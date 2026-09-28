function OfferSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Card 1 */}

          <div className="bg-[#E8F8EC] rounded-3xl overflow-hidden">

            <div className="grid md:grid-cols-2 items-center">

              <div className="p-10">

                <span className="text-green-600 font-semibold">
                  100% Organic
                </span>

                <h2 className="text-4xl font-bold mt-3 leading-tight">
                  Fresh <br />
                  Vegetables
                </h2>

                <p className="text-gray-600 mt-4">
                  Healthy & Fresh Every Day
                </p>

                <button className="mt-7 bg-green-600 text-white px-7 py-3 rounded-full hover:bg-green-700 duration-300">
                  Shop Now
                </button>

              </div>

              <div>
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600"
                  alt="Vegetables"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>

          </div>

          {/* Card 2 */}

          <div className="bg-[#FFF4E5] rounded-3xl overflow-hidden">

            <div className="grid md:grid-cols-2 items-center">

              <div className="p-10">

                <span className="text-orange-500 font-semibold">
                  Fresh Fruits
                </span>

                <h2 className="text-4xl font-bold mt-3 leading-tight">
                  Daily <br />
                  Fresh Fruits
                </h2>

                <p className="text-gray-600 mt-4">
                  Directly From Farm
                </p>

                <button className="mt-7 bg-orange-500 text-white px-7 py-3 rounded-full hover:bg-orange-600 duration-300">
                  Shop Now
                </button>

              </div>

              <div>
                <img
                  src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600"
                  alt="Fruits"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default OfferSection;