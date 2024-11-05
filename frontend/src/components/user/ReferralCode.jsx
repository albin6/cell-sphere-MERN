import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";
import { toast } from "react-toastify";

export default function ReferralCode() {
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState("");

  const handleApplyCode = async () => {
    console.log("Applying referral code:", referralCode);
    const response = await axiosInstance.post("/api/users/verify-referral", {
      code: referralCode,
    });
    if (response.data.success) {
      toast.success(response.data.message, { position: "top-center" });
      navigate("/");
    } else {
      toast.error("");
    }
  };

  const handleSkip = () => {
    console.log("Skipping referral code entry");
    navigate("/");
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
        Referral Code
      </h2>
      <div className="space-y-2">
        <label
          htmlFor="referralCode"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Enter Referral Code (Optional)
        </label>
        <input
          type="text"
          id="referralCode"
          placeholder="Enter code"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleApplyCode}
          disabled={!referralCode}
          className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            referralCode
              ? "bg-primary hover:bg-primary-dark focus:ring-primary"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Apply Code
        </button>
        <button
          onClick={handleSkip}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          No Code, Skip
        </button>
      </div>
    </div>
  );
}
