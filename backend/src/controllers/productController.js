const Product = require("../models/Product");

// Escape user input before using it inside a RegExp (prevents regex injection / ReDoS)
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ===============================
// GET ALL PRODUCTS
// ===============================
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      sort,
      featured,
      bestSelling,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    // ===============================
    // FEATURED / BEST SELLING FILTERS
    // ===============================
    if (featured === "true") {
      query.featured = true;
    }

    if (bestSelling === "true") {
      query.bestSelling = true;
    }

    // ===============================
    // SEARCH
    // ===============================
    if (search) {
      const safeSearch = escapeRegex(String(search));

      query.$or = [
        {
          name: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          description: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: safeSearch,
            $options: "i",
          },
        },
      ];
    }

    // ===============================
    // RATING FILTER
    // ===============================
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // ===============================
    // CATEGORY FILTER
    // ===============================
    if (category) {
      query.category = category;
    }

    // ===============================
    // PRICE FILTER
    // ===============================
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // ===============================
    // SORTING
    // ===============================
    let sortOption = {};

    if (sort === "price_asc") {
      sortOption.price = 1;
    }

    if (sort === "price_desc") {
      sortOption.price = -1;
    }

    if (sort === "newest") {
      sortOption.createdAt = -1;
    }

    if (sort === "oldest") {
      sortOption.createdAt = 1;
    }

    if (Object.keys(sortOption).length === 0) {
      sortOption._id = 1;
    }

    // ===============================
    // PAGINATION
    // ===============================
    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(50, Math.max(1, Number(limit) || 10));

    const skip = (pageNumber - 1) * limitNumber;

    // Total matching products
    const totalProducts = await Product.countDocuments(query);

    // Get products
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    // Total pages
    const totalPages = Math.ceil(
      totalProducts / limitNumber
    );

    res.status(200).json({
      success: true,

      pagination: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalProducts,
        totalPages,
      },

      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};
// ===============================
// GET ALL CATEGORIES (distinct)
// ===============================
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");

    res.status(200).json({
      success: true,
      categories: categories.sort(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// ===============================
// GET SINGLE PRODUCT
// ===============================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// ===============================
// CREATE PRODUCT
// ===============================
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      stock,
      brand,
      oldPrice,
      discount,
      featured,
      bestSelling,
    } = req.body;

    // Required fields check
    if (
      !name ||
      !description ||
      price === undefined ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, description, price and category",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock,
      brand,
      oldPrice,
      discount,
      featured,
      bestSelling,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// ===============================
// UPDATE PRODUCT
// ===============================
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// ===============================
// DELETE PRODUCT
// ===============================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};