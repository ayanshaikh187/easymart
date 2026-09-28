import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { getBestSellingProducts } from "../../services/productService";

function BestSelling() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBestSellingProducts(4);

        setProducts(data.products || []);
      } catch (err) {
        console.error("Best selling products fetch error:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-center mb-12">
          <div>
            <p className="text-green-600 font-semibold">
              Best Seller
            </p>

            <h2 className="text-4xl font-bold mt-2">
              Best Selling Products
            </h2>
          </div>

          <Link
            to="/shop"
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 duration-300"
          >
            View All
          </Link>
        </div>

        {loading && (
          <p className="text-center text-gray-500">Loading products...</p>
        )}

        {!loading && error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-500">No best sellers yet.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={{ ...product, id: product._id }}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default BestSelling;
