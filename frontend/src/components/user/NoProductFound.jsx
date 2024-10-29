import { Smartphone } from "lucide-react";
import React from "react";

function NoProductFoundUser() {
  return (
    <main className="max-w-7xl mb-36 mt-1 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white p-8 rounded shadow text-center">
            <Smartphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No products found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any mobile phones matching your criteria.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default NoProductFoundUser;
