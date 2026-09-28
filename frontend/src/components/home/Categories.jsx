import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../services/productService";

// Icons for known categories (unknown ones get a default)
const ICONS = {
  Fruits: "🍎",
  Vegetables: "🥦",
  "Healthy Foods": "🥗",
  "Dairy & Eggs": "🥛",
  Grocery: "🛒",
};

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center">Shop By Category</h2>

        <p className="text-center text-gray-500 mt-3">
          Fresh products from every category
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-14">
          {categories.map((name) => (
            <Link
              key={name}
              to={`/shop?category=${encodeURIComponent(name)}`}
              className="rounded-3xl border hover:border-green-600 hover:-translate-y-2 duration-300 shadow-sm p-6 text-center"
            >
              <span className="text-6xl block">{ICONS[name] || "🛍️"}</span>

              <h3 className="mt-5 font-semibold text-lg">{name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
