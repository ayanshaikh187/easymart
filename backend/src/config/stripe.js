const Stripe = require("stripe");

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn(
    "WARNING: STRIPE_SECRET_KEY is missing in backend/.env - card payments will not work."
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_missing");

module.exports = stripe;
