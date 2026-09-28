// Usage:
//   npm run seed            -> wipes products, inserts sample products, creates admin user
//   npm run seed:destroy    -> deletes products only
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Product = require("../src/models/Product");
const User = require("../src/models/User");
const products = require("./products.json");

const ADMIN = {
  name: "Admin",
  email: "admin@easymart.com",
  password: "Admin@12345",
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  await Product.deleteMany();
  console.log("Old products removed");

  if (process.argv.includes("--destroy")) {
    console.log("Done (destroy only)");
    return;
  }

  await Product.insertMany(products);
  console.log(`${products.length} products inserted`);

  const existing = await User.findOne({ email: ADMIN.email });

  if (!existing) {
    const salt = await bcrypt.genSalt(10);

    await User.create({
      name: ADMIN.name,
      email: ADMIN.email,
      password: await bcrypt.hash(ADMIN.password, salt),
      role: "admin",
    });

    console.log(`Admin created -> ${ADMIN.email} / ${ADMIN.password}`);
  } else {
    console.log("Admin user already exists");
  }
};

run()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
