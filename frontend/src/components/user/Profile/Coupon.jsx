import { useEffect, useState } from "react";
import { Scissors, Copy, Check } from "lucide-react";
import { useAllCoupons } from "../../../hooks/CustomHooks";
import { getAllCouponsUser } from "../../../utils/coupon/couponCRUD";
import Pagination from "../Pagination";
import NoCouponFound from "./NoCouponFound";

export default function Coupon() {
  const [coupons, setCoupons] = useState([]);

  const [copiedCode, setCopiedCode] = useState("");

  const itemsPerPage = 4;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [noCouponFound, setNoCouponFound] = useState(false);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { data: couponsData, isLoading } = useAllCoupons(
    getAllCouponsUser,
    currentPage,
    itemsPerPage
  );

  useEffect(() => {
    if (couponsData?.coupons.length > 0) {
      setCoupons(couponsData?.coupons);
      setTotalPages(couponsData?.totalPages);
      setCurrentPage(couponsData?.currentPage);
      setNoCouponFound(false);
    } else {
      setNoCouponFound(true);
    }
  }, [couponsData]);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(""), 3000);
    });
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (noCouponFound) {
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Available Coupons
        </h1>
        {noCouponFound ? (
          <NoCouponFound />
        ) : (
          <div className="space-y-6">
            {coupons &&
              coupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className="bg-white shadow-md rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Scissors className="w-6 h-6 text-primary mr-2" />
                      <h2 className="text-xl font-semibold text-gray-800">
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}%`
                          : `₹${coupon.discount_value}`}{" "}
                        OFF
                      </h2>
                    </div>
                    <span className="text-sm text-gray-500">
                      Expires:{" "}
                      {new Date(coupon.expiration_date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{coupon.description}</p>
                  <div className="flex items-center justify-between bg-gray-100 rounded-md p-3">
                    <code className="text-sm font-mono text-primary">
                      {coupon.code}
                    </code>
                    <button
                      onClick={() => copyToClipboard(coupon.code)}
                      className="flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-150"
                      aria-label={`Copy coupon code ${coupon.code}`}
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy Code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            {!noCouponFound && (
              <Pagination
                currentPage={currentPage}
                paginate={paginate}
                totalPages={totalPages}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
