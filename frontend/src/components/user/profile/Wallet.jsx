import { useEffect, useState } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  CreditCard,
  RefreshCw,
  Heading3,
} from "lucide-react";
import { useWalletBalance } from "../../../hooks/CustomHooks";
import AddFundModal from "./AddFundModal";

export default function Wallet() {
  const { data: wallet, isLoading } = useWalletBalance();

  const [addFundModal, setAddFundModal] = useState(false);

  useEffect(() => {
    console.log(wallet);
    setBalance(wallet?.balance);
    setTransactions(wallet?.transactions);
  }, [wallet]);

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  if (isLoading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Wallet</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Wallet Balance
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-gray-900">
              ₹{balance && balance.toFixed(2)}
            </p>
            <div className="space-x-2">
              <button
                onClick={() => setAddFundModal(true)}
                className="bg-gray-800 text-white hover:bg-gray-700 font-medium py-2 px-4 rounded text-sm transition duration-150 ease-in-out"
              >
                Add Funds
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Recent Transactions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="py-2 px-4 font-medium">Type</th>
                  <th className="py-2 px-4 font-medium">Amount</th>
                  <th className="py-2 px-4 font-medium">Date</th>
                  <th className="py-2 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions &&
                  transactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="border-b last:border-b-0"
                    >
                      <td className="py-3 px-4">
                        {transaction.transaction_type === "debit" && (
                          <CreditCard className="w-4 h-4 text-red-500 inline mr-2" />
                        )}
                        {transaction.transaction_type === "credit" && (
                          <RefreshCw className="w-4 h-4 text-green-500 inline mr-2" />
                        )}
                        <span className="text-sm text-gray-700">
                          {transaction.transaction_type
                            .charAt(0)
                            .toUpperCase() +
                            transaction.transaction_type.slice(1)}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 text-sm ${
                          transaction.amount >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount >= 0 ? "+" : "-"}₹
                        {Math.abs(transaction.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(
                          transaction.transaction_date
                        ).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {transaction.transaction_status}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {addFundModal && (
              <AddFundModal
                isOpen={addFundModal}
                onClose={() => setAddFundModal(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
