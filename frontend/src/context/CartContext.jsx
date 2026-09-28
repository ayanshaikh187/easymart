import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

const COUPONS = { SAVE10: 10, SAVE20: 20 }; // percent (server re-checks these)
const MONGO_ID = /^[a-f\d]{24}$/i;

// Old carts saved with numeric ids (from the previous static data) are dropped
const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");

    return Array.isArray(saved)
      ? saved.filter((item) => MONGO_ID.test(String(item.id)))
      : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadCart);
  const [coupon, setCoupon] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add product (qty defaults to 1)
  const addToCart = (product, qty = 1) => {
    if (product.stock !== undefined && product.stock < 1) {
      toast.error("This product is out of stock");
      return;
    }

    const exist = cart.find((item) => item.id === product.id);

    if (exist) {
      const newQty = exist.quantity + qty;

      if (product.stock !== undefined && newQty > product.stock) {
        toast.error(`Only ${product.stock} in stock`);
        return;
      }

      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        )
      );

      toast.success("Product quantity updated 🛒");
    } else {
      if (product.stock !== undefined && qty > product.stock) {
        toast.error(`Only ${product.stock} in stock`);
        return;
      }

      setCart([...cart, { ...product, quantity: qty }]);

      toast.success("Product added to cart ✅");
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));

    toast.error("Product removed");
  };

  // clearCart(true) => silent (used after successful payment)
  const clearCart = (silent) => {
    setCart([]);
    setCoupon("");

    if (silent !== true) toast.info("Cart cleared");
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (item.stock !== undefined && item.quantity >= item.stock) {
          toast.error(`Only ${item.stock} in stock`);
          return item;
        }

        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ---------- Calculations (same rules as backend utils/pricing.js) ----------
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping =
    cart.length === 0
      ? 0
      : shippingMethod === "express"
        ? 25
        : subtotal > 100
          ? 0
          : 10;

  const tax = Math.round(subtotal * 5) / 100;

  // Derived, so it stays correct when the cart changes
  const percent = COUPONS[coupon.toUpperCase()] || 0;
  const discount = Math.round(subtotal * percent) / 100;

  const total = subtotal + shipping + tax - discount;

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const applyCoupon = (code) => {
    const couponCode = String(code || "").trim().toUpperCase();

    if (COUPONS[couponCode]) {
      setCoupon(couponCode);
      return true;
    }

    setCoupon("");
    return false;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        subtotal,
        shipping,
        tax,
        total,
        totalItems,
        coupon,
        discount,
        applyCoupon,
        shippingMethod,
        setShippingMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
