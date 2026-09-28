import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/home/Footer";
import { getProductById } from "../services/productService";
import RelatedProducts from "../components/product/RelatedProducts";
import ProductReviews from "../components/product/ProductReviews";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);

        setProduct({ ...data.product, id: data.product._id });
      } catch (err) {
        console.error("Product fetch error:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    setQuantity(1);
  }, [id]);

  if (loading || error || !product) {
    return (
      <>
        <Navbar />

        <h1 className="text-center py-40 text-2xl font-semibold">
          {loading ? "Loading product..." : error || "Product Not Found"}
        </h1>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-10 items-center">

          <img
            src={product.image}
            alt={product.name}
            className="w-full max-h-[600px] object-cover rounded-3xl shadow-lg"
          />

          <div>

            <span className="text-green-600 font-semibold">
              {product.category}
            </span>

            <h1 className="text-5xl font-bold mt-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mt-4 text-yellow-500">
              <FaStar />
              <span>{product.rating}</span>
            </div>

            <div className="mt-8 flex items-center gap-5">

              <span className="text-4xl font-bold text-green-600">
                ${product.price}
              </span>

              {product.oldPrice ? (
                <del className="text-gray-400 text-2xl">
                  ${product.oldPrice}
                </del>
              ) : null}

            </div>

            <p
              className={`mt-4 font-semibold ${
                product.stock > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.stock > 0
                ? `In stock (${product.stock} available)`
                : "Out of stock"}
            </p>

            <p className="text-gray-600 mt-8 leading-8">
              {product.description ||
                "Fresh organic product directly from our trusted farms. Premium quality with fast home delivery."}
            </p>

            <div className="flex items-center gap-4 mt-6">

              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                -
              </button>

              <span className="text-xl font-bold">{quantity}</span>

              <button
                onClick={() =>
                  setQuantity((prev) => Math.min(product.stock || 1, prev + 1))
                }
                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                +
              </button>

            </div>

            <button
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock < 1}
              className="mt-10 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-10 py-4 rounded-full"
            >
              {product.stock < 1 ? "Out of Stock" : "Add To Cart"}
            </button>

          </div>

        </div>

      </section>
      <RelatedProducts currentProduct={product} />
      <ProductReviews />
      <Footer />
    </>
  );
}

export default ProductDetails;
