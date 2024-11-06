import { Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import Pagination from "../user/Pagination";

function OfferTable({
  productOrCategory,
  offers,
  onDelete,
  currentPage,
  totalPages,
  paginate,
}) {
  const [offerId, setOfferId] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Applied {productOrCategory}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Value
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              End Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {offers &&
            offers.map((offer) => (
              <tr key={offer._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {offer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {offer.target_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {offer.offer_value}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(offer.end_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setIsConfirmationModalOpen(true);
                      setOfferId(offer._id);
                    }}
                    className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {offers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={() => {
            setIsConfirmationModalOpen(false);
            onDelete(offerId);
          }}
          isOpen={isConfirmationModalOpen}
        />
      )}
    </div>
  );
}

export default OfferTable;
