// Generate Random ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 10);
};

// Capitalize First Letter
export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Get Discount Percentage
export const getDiscountPercentage = (price, oldPrice) => {
  if (!oldPrice || oldPrice <= price) return 0;

  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

// Filter Products By Category
export const filterByCategory = (products, category) => {
  if (category === "All") return products;

  return products.filter(
    (product) => product.category === category
  );
};

// Search Products
export const searchProducts = (products, searchTerm) => {
  return products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Calculate Cart Total
export const calculateCartTotal = (cart) => {
  return cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};