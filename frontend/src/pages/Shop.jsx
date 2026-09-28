import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/home/Footer";
import ProductCard from "../components/home/ProductCard";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import { useSearchParams } from "react-router-dom";
import { getProducts, getCategories } from "../services/productService";

function Shop() {
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [rating, setRating] = useState(0);

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const productsPerPage = 8;

  // Wait 400ms after typing stops before calling the API
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Category list comes from the database (once)
  useEffect(() => {
    getCategories()
      .then((data) => setCategoryList(data.categories || []))
      .catch(() => setCategoryList([]));
  }, []);

  // ==========================================
  // FETCH PRODUCTS FROM BACKEND
  // ==========================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page: currentPage,
          limit: productsPerPage,
        };

        if (debouncedSearch) {
          params.search = debouncedSearch;
        }

        if (category !== "All") {
          params.category = category;
        }

        if (maxPrice < 1000) {
          params.maxPrice = maxPrice;
        }

        if (rating > 0) {
          params.minRating = rating;
        }

        if (sort === "low") {
          params.sort = "price_asc";
        }

        if (sort === "high") {
          params.sort = "price_desc";
        }

        const data = await getProducts(params);

        setProducts(data.products || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Products fetch error:", error);
        setError(error.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    debouncedSearch,
    category,
    sort,
    currentPage,
    maxPrice,
    rating,
  ]);

  // ==========================================
  // GET CATEGORIES
  // ==========================================

  const categories = ["All", ...categoryList];

  // ==========================================
  // RESET FILTERS
  // ==========================================

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("");
    setRating(0);
    setMaxPrice(1000);
    setCurrentPage(1);
  };

  // ==========================================
  // SEARCH / FILTER CHANGE
  // ==========================================

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setCurrentPage(1);
  };

  const handlePriceChange = (e) => {
    setMaxPrice(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleRatingChange = (e) => {
    setRating(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-20">

        <h1 className="text-5xl font-bold mb-10">
          Shop
        </h1>

        {/* ======================================
            FILTERS
        ====================================== */}

        <div className="grid md:grid-cols-3 gap-5 mb-10">

          <SearchBar
            value={search}
            onChange={handleSearchChange}
          />

          <select
            className="border p-3 rounded-xl"
            value={category}
            onChange={handleCategoryChange}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <div>
            <label className="font-semibold">
              Max Price: ${maxPrice}
            </label>

            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={maxPrice}
              onChange={handlePriceChange}
              className="w-full mt-3 accent-green-600"
            />
          </div>

          <select
            className="border p-3 rounded-xl"
            value={sort}
            onChange={handleSortChange}
          >
            <option value="">Sort</option>

            <option value="low">
              Price Low → High
            </option>

            <option value="high">
              Price High → Low
            </option>
          </select>

          <select
            className="border p-3 rounded-xl"
            value={rating}
            onChange={handleRatingChange}
          >
            <option value="0">
              All Ratings
            </option>

            <option value="3.5">
              3.5★ & Above
            </option>

            <option value="3.8">
              3.8★ & Above
            </option>

            <option value="4">
              4★ & Above
            </option>
          </select>

          <button
            onClick={resetFilters}
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl p-3"
          >
            Reset Filters
          </button>

        </div>

        {/* ======================================
            LOADING
        ====================================== */}

        {loading && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">
              Loading products...
            </h2>
          </div>
        )}

        {/* ======================================
            ERROR
        ====================================== */}

        {!loading && error && (
          <div className="text-center py-20">

            <h2 className="text-3xl font-bold text-red-500">
              Failed to load products
            </h2>

            <p className="text-gray-500 mt-3">
              {error}
            </p>

          </div>
        )}

        {/* ======================================
            PRODUCTS
        ====================================== */}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">

            <h2 className="text-4xl font-bold">
              No Products Found
            </h2>

            <p className="text-gray-500 mt-3">
              Try another search or filter.
            </p>

          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={{
                  ...product,
                  id: product._id,
                }}
              />
            ))}

          </div>
        )}

        {/* ======================================
            PAGINATION
        ====================================== */}

        {!loading && !error && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}

      </section>

      <Footer />
    </>
  );
}

export default Shop;