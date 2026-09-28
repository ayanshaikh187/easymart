const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get user's cart
router.get("/", protect, getCart);

// Add product
router.post("/add", protect, addToCart);

// Update quantity
router.put("/update", protect, updateCartItem);

// Remove product
router.delete("/remove/:productId", protect, removeFromCart);

// Clear cart
router.delete("/clear", protect, clearCart);

module.exports = router;