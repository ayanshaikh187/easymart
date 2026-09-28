// Single source of truth for shipping / tax / coupons.
// The frontend shows the same numbers, but the SERVER always recalculates.

const TAX_RATE = 0.05;

const COUPONS = {
  SAVE10: 10, // percent
  SAVE20: 20,
};

const round2 = (n) => Math.round(n * 100) / 100;

const calculatePricing = (subtotal, shippingMethod = "standard", couponCode = "") => {
  const shippingPrice =
    shippingMethod === "express" ? 25 : subtotal > 100 ? 0 : 10;

  const taxPrice = round2(subtotal * TAX_RATE);

  const percent = COUPONS[String(couponCode || "").toUpperCase()] || 0;
  const discount = round2((subtotal * percent) / 100);

  const total = round2(subtotal + shippingPrice + taxPrice - discount);

  return { subtotal: round2(subtotal), shippingPrice, taxPrice, discount, total };
};

module.exports = { calculatePricing, COUPONS };
