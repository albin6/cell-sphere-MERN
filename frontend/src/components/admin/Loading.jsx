import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="h-8 w-32 bg-gray-200  rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-200  rounded-full animate-pulse"></div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white  h-screen">
          <nav className="mt-5 px-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200  rounded mt-3 animate-pulse"
              ></div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page title */}
            <div className="h-8 w-64 bg-gray-200  rounded mb-6 animate-pulse"></div>

            {/* Content skeleton */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200  rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>

              {/* Loading spinner */}
              <div className="flex justify-center items-center mt-8">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  Loading...
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
