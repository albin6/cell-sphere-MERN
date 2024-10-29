import { Search } from "lucide-react";
import React from "react";

function NoProductForTheSearch({ searchQuery }) {
  return (
    <div className="w-full col-span-full">
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Search className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          No products found
        </h2>
        <p className="text-gray-500 text-center max-w-md">
          We couldn't find any products matching "{searchQuery}". Please try a
          different search term or browse our categories.
        </p>
      </div>
    </div>
  );
}

export default NoProductForTheSearch;
