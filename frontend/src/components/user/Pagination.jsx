import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ currentPage, totalPages, paginate }) {
  return (
    <div className="mt-8 flex justify-center">
      <nav className="inline-flex rounded-md shadow">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage == 1}
          className="px-2 sm:px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        </button>
        <div className="hidden sm:flex">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 border border-gray-300 text-sm font-medium ${
                currentPage === index + 1
                  ? "bg-gray-50 border-gray-500 text-gray-600"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <span className="sm:hidden px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => paginate(Number(currentPage) + 1)}
          disabled={currentPage == totalPages}
          className="px-2 sm:px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="sr-only">Next</span>
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}

export default Pagination;
