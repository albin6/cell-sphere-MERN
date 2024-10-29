export default function ProductListingShimmer() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 pr-4">
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center mb-2">
                <div className="h-4 w-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
          <div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center mb-2">
                <div className="h-4 w-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="w-3/4">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-1/6 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 shadow-sm">
                <div className="h-48 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-8 bg-gray-200 rounded-full mx-1 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
