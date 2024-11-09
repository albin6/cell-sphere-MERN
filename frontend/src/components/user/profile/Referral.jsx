import { useState } from "react";
import { ClipboardCopy } from "lucide-react";
import { toast } from "react-toastify";

export default function Referral({ referralCode = "ABC123" }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setIsCopied(true);
      toast.success("Referral code copied to clipboard", {
        position: "top-center",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="max-w-5xl bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full mb-16 max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Refer a Friend</h2>
          <p className="text-sm text-gray-600 mt-1">
            Share the love and earn rewards!
          </p>
        </div>
        <div className="px-6 py-4">
          <p className="text-gray-700 mb-4">
            Invite your friends to join our platform. For each friend who signs
            up using your unique referral code, you'll both receive amazing
            benefits!
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-800">
              Your Referral Code
            </h3>
            <div className="flex items-center space-x-2">
              <input
                value={referralCode}
                readOnly
                className="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-md font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <ClipboardCopy className="h-5 w-5 text-gray-600" />
                <span className="sr-only">Copy referral code</span>
              </button>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50">
          <p className="text-xs text-gray-600">
            Terms and conditions apply. Rewards are subject to change.
          </p>
        </div>
      </div>
    </div>
  );
}
