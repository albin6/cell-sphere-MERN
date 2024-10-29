import React from "react";

export default function SmartphoneStoreShimmer() {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-8 py-12">
        {/* Hero section */}
        <div className="text-center space-y-4">
          <div className="h-10 bg-gray-200 rounded-full max-w-3xl mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded-full max-w-xl mx-auto"></div>
          <div className="h-10 bg-gray-200 rounded-full max-w-[120px] mx-auto mt-8"></div>
        </div>

        {/* Shop by Category section */}
        <div className="mt-16">
          <div className="h-8 bg-gray-200 rounded-full max-w-xs mb-8"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded-full w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="relative w-full h-full overflow-hidden">
          <div className="absolute top-0 -inset-x-full bottom-0 animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
