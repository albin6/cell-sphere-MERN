import { Search, Sliders, Smartphone, X } from "lucide-react";
import SearchHeader from "./SearchHeader";

export default function NoProducctsFound({
  setFilterCategory,
  filterCategory,
  categories,
  setSortBy,
  sortBy,
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <label htmlFor="category-filter" className="font-medium">
            Filter by Category:
          </label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category.title}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <label htmlFor="sort-by" className="font-medium">
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
          </select>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="bg-white p-8 rounded shadow text-center">
              <Smartphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No products found
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any mobile phones matching your criteria. Try
                adjusting your search or filters.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
