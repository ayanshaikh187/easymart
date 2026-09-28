import { FaSearch, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { Link , NavLink } from "react-router-dom";
import useScroll from "../../hooks/useScroll";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const isScrolled = useScroll();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
      ? "bg-white shadow-lg py-3"
      : "bg-transparent py-5"
      }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-green-600">
          EasyMart
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          <Link to="/" className="hover:text-green-600 duration-300">
            Home
          </Link>

          <Link to="/shop" className="hover:text-green-600 duration-300">
            Shop
          </Link>

          <Link to="/cart" className="hover:text-green-600 duration-300">
            Cart
          </Link>

          <Link to="/about" className="hover:text-green-600 duration-300">
            About
          </Link>

          <Link to="/contact" className="hover:text-green-600 duration-300">
            Contact
          </Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <FaSearch className="text-xl cursor-pointer hover:text-green-600 duration-300" />
          {user ? (

            <div className="flex items-center gap-4">

              <Link
                to="/wishlist"
                className="relative"
              >
                <FaHeart size={22} />

                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative"
              >
                <FaShoppingCart size={22} />

                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>

              <Link
                to="/orders"
                className="hover:text-green-600 duration-300 font-medium"
              >
                Orders
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2"
              >
                <FaUser />

                <span>
                  {user.name}
                </span>
              </Link>

              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl"
              >
                Logout
              </button>

            </div>

          ) : (

            <div className="flex gap-4">

              <Link
                to="/login"
                className="bg-green-600 text-white px-5 py-2 rounded-xl"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="border border-green-600 text-green-600 px-5 py-2 rounded-xl"
              >
                Signup
              </Link>

            </div>

          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;