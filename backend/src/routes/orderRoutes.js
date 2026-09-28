const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Create order (Cash on Delivery)
router.post("/", protect, createOrder);

// Logged-in user's orders   (must be BEFORE "/:id")
router.get("/my", protect, getMyOrders);

// Admin: all orders
router.get("/", protect, admin, getAllOrders);

// Single order (owner or admin)
router.get("/:id", protect, getOrderById);

// Admin: update status
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
