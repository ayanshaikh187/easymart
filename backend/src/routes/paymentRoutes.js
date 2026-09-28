const express = require("express");

const {
  createCheckoutSession,
  confirmPayment,
  stripeWebhook,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-checkout-session", protect, createCheckoutSession);

router.post("/confirm", protect, confirmPayment);

// Raw body is enabled in server.js (before express.json)
router.post("/webhook", stripeWebhook);

module.exports = router;
