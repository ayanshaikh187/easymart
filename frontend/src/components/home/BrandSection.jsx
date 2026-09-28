const brands = [
  {
    id: 1,
    name: "FreshFarm",
    logo: "🥬",
  },
  {
    id: 2,
    name: "Organic",
    logo: "🍎",
  },
  {
    id: 3,
    name: "Healthy",
    logo: "🥕",
  },
  {
    id: 4,
    name: "Nature",
    logo: "🌽",
  },
  {
    id: 5,
    name: "GreenLife",
    logo: "🥦",
  },
];

function Brands() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          Trusted Brands
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-12">

          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-gray-50 rounded-3xl p-8 text-center shadow hover:shadow-lg hover:-translate-y-2 duration-300"
            >
              <div className="text-6xl">{brand.logo}</div>

              <h3 className="mt-5 font-bold text-xl">
                {brand.name}
              </h3>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Brands;