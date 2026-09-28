function Newsletter() {
  return (
    <section className="py-20 bg-green-600">

      <div className="max-w-5xl mx-auto px-6 text-center">

        <h2 className="text-5xl font-bold text-white">
          Subscribe Our Newsletter
        </h2>

        <p className="text-green-100 mt-5 text-lg">
          Get latest offers and fresh grocery updates.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-10">

          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-6 py-4 rounded-full outline-none bg-white"
          />

          <button className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 duration-300">
            Subscribe
          </button>

        </div>

      </div>

    </section>
  );
}

export default Newsletter;