import apiRequest from "../utils/api";

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  const queryString = query.toString();

  return apiRequest(`/products${queryString ? `?${queryString}` : ""}`);
};

export const getProductById = async (id) => {
  return apiRequest(`/products/${id}`);
};

export const getCategories = async () => {
  return apiRequest("/products/categories");
};

export const getFeaturedProducts = async (limit = 8) => {
  return getProducts({ featured: true, limit });
};

export const getBestSellingProducts = async (limit = 4) => {
  return getProducts({ bestSelling: true, limit });
};

export const getRelatedProducts = async (category, excludeId, limit = 5) => {
  const data = await getProducts({ category, limit });
  const products = data.products || [];

  return products.filter((item) => item._id !== excludeId).slice(0, limit - 1);
};
