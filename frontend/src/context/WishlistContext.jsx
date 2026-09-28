import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const WishlistContext = createContext();

const MONGO_ID = /^[a-f\d]{24}$/i;

const loadWishlist = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");

    return Array.isArray(saved)
      ? saved.filter((item) => MONGO_ID.test(String(item.id)))
      : [];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(loadWishlist);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    const exist = wishlist.find((item) => item.id === product.id);

    if (exist) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));

      toast.error("Removed from Wishlist");
    } else {
      setWishlist([...wishlist, product]);

      toast.success("Added to Wishlist ❤️");
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
