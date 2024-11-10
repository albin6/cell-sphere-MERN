import React, { useEffect, useState } from "react";
import { CalendarIcon, Check, Copy, TagIcon, XIcon } from "lucide-react";
import Pagination from "../Pagination";
import NoCouponFound from "../profile/NoCouponFound";
import { useAllCoupons } from "../../../hooks/CustomHooks";
import { getAllCouponsUser } from "../../../utils/coupon/couponCRUD";

export default function AvailableCouponModal({ closeModal }) {
  const [coupons, setCoupons] = useState([]);
  const itemsPerPage = 4;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [noCouponFound, setNoCouponFound] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { data: couponsData, isLoading } = useAllCoupons(
    getAllCouponsUser,
    currentPage,
    itemsPerPage
  );

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(""), 3000);
    });
  };

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

  if (isLoading) {
    return (
      <h3 className="text-center text-xl font-semibold text-gray-700">
        Loading...
      </h3>
    );
  }

  if (noCouponFound) {
    return <NoCouponFound />;
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={closeModal}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={closeModal}
            >
              <span className="sr-only">Close</span>
              <XIcon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
          <div className="sm:flex sm:items-start">
            <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
              <h3
                className="text-2xl font-bold leading-6 text-gray-900 mb-8"
                id="modal-title"
              >
                Available Coupons
              </h3>
              <div className="mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon._id}
                      className="bg-white shadow-sm rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-300 ease-in-out"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-base font-semibold text-gray-800 leading-tight">
                          {coupon.description}
                        </h4>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-white">
                          {coupon.discount_value}
                          {coupon.discount_type === "percentage"
                            ? "%"
                            : "$"}{" "}
                          OFF
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center justify-between bg-gray-100 rounded-md px-2    py-1 mb-2">
                          <code className="text-sm font-mono text-primary">
                            {coupon.code}
                          </code>
                          <button
                            onClick={() => copyToClipboard(coupon.code)}
                            className="ml-4 flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-150"
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
                        <div className="flex items-center text-xs text-gray-600 mb-2">
                          <CalendarIcon className="w-4 h-4 mr-1 text-gray-500" />
                          <span>
                            Expires:{" "}
                            <span className="font-medium">
                              {new Date(
                                coupon.expiration_date
                              ).toLocaleDateString()}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {coupon.eligible_categories.map((category) => (
                          <span
                            key={category._id}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800"
                          >
                            {category.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col justify-between items-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            />
            <div className="mt-3 text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
