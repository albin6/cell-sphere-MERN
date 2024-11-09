import React from "react";
import ProductCard from "./ProductCard";
import { Button } from "../ui/ui-components";
import { Link } from "react-router-dom";
import { useSpecificCategory } from "../../hooks/CustomHooks";

function Suggession({ categoryId }) {
  const { data, isLoading, isError } = useSpecificCategory(categoryId);

  if (isLoading) {
    return <h3>Loading..</h3>;
  }

  if (isError) {
    return <h3>Error..</h3>;
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 md:px-8 bg-gray-50">
      <Link to="/products/list">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            Related Products...
          </h2>
          <Button
            variant="outline"
            className="border-gray-300 bg-gray-800 text-white hover:bg-gray-700"
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
          {data &&
            data
              .slice(0, 5)
              .map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>
      </Link>
    </section>
  );
}

export default Suggession;
