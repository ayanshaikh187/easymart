import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const inWishlist = wishlist.some((item) => item.id === product.id);
  const outOfStock = product.stock !== undefined && product.stock < 1;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl duration-300">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-64 w-full object-cover group-hover:scale-110 duration-500"
          />
        </Link>

        {product.discount > 0 && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            -{product.discount}%
          </span>
        )}

        <button
          onClick={() => toggleWishlist(product)}
          aria-label="Toggle wishlist"
          className={`absolute top-4 right-4 p-3 rounded-full shadow duration-300 ${
            inWishlist
              ? "bg-red-500 text-white"
              : "bg-white hover:bg-green-600 hover:text-white"
          }`}
        >
          <FaHeart />
        </button>
      </div>

      <div className="p-6">
        <p className="text-sm text-green-600">{product.category}</p>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-xl mt-2">{product.name}</h3>
        </Link>

        <div className="flex items-center gap-1 text-yellow-500 mt-2">
          <FaStar />
          <span>{Number(product.rating || 0).toFixed(1)}</span>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <span className="text-2xl font-bold text-green-600">
            ${Number(product.price).toFixed(2)}
          </span>

          {product.oldPrice > product.price && (
            <del className="text-gray-400">
              ${Number(product.oldPrice).toFixed(2)}
            </del>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={outOfStock}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-full flex justify-center items-center gap-2"
        >
          <FaShoppingCart />
          {outOfStock ? "Out of Stock" : "Add To Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
