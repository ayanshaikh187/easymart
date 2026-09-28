import { useEffect, useState } from "react";
import { getFeaturedProducts } from "../../services/productService";
import ProductCard from "./ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getFeaturedProducts(8);

        setProducts(data.products || []);
      } catch (err) {
        console.error("Featured products fetch error:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-20">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          Our Popular Products
        </h2>

        <p className="text-center text-gray-500 mt-3">
          Fresh products directly from farms
        </p>

        {loading && (
          <p className="text-center mt-14 text-gray-500">Loading products...</p>
        )}

        {!loading && error && (
          <p className="text-center mt-14 text-red-500">{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-center mt-14 text-gray-500">No products yet.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">

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

export default Products;
