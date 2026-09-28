const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get wishlist
router.get("/", protect, getWishlist);

// Add product
router.post("/add", protect, addToWishlist);

// Remove product
router.delete("/remove/:productId", protect, removeFromWishlist);

module.exports = router;