const express = require("express");

const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, getMe);

router.put("/profile", protect, updateProfile);

router.post("/forgot-password", forgotPassword);

router.put("/reset-password/:token", resetPassword);

router.get("/admin-test", protect, admin, (req, res) => {
  res.json({
    message: "Welcome Admin! You have access.",
    user: req.user,
  });
});

module.exports = router;