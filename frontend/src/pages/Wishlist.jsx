import Navbar from "../components/layout/Navbar";
import Footer from "../components/home/Footer";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <>
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
        <h1 className="text-5xl font-bold mb-10">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-semibold">
              Your wishlist is empty ❤️
            </h2>

            <p className="text-gray-500 mt-3">
              Add your favorite products here.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl shadow p-5"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover rounded-2xl"
                />

                <h2 className="font-bold text-xl mt-5">
                  {product.name}
                </h2>

                <p className="text-green-600 font-semibold mt-2">
                  ${product.price}
                </p>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
                  >
                    Add To Cart
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className="bg-red-500 text-white px-4 rounded-xl hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default Wishlist;