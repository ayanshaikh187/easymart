import { FaSearch } from "react-icons/fa";

function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search products..."
        className="w-full border rounded-full py-4 pl-12 pr-5 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

    </div>
  );
}

export default SearchBar;