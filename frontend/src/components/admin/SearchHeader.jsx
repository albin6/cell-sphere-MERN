import { Search } from "lucide-react";
import React from "react";

function SearchHeader() {
  return (
    <header className="bg-white shadow mb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <div className="relative">
            <input
              type="search"
              placeholder="Search phones..."
              className="w-full sm:w-64 pr-10 pl-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default SearchHeader;
