import React, { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";

export default function OTPVerification({ onVerify, email, onResendOTP }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputs = useRef([]);

  const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }
    setError("");
    onVerify(otpString);
  };

  const handleResendOTP = () => {
    setOtp(["", "", "", "", "", ""]);
    onResendOTP(); // trigger OTP resend logic
    setTimeout(() => setTimeLeft(60), 8000); // reset the timer to 60 seconds
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
      <p className="mb-4 text-sm text-gray-600">
        We've sent a 6-digit OTP to {email}. Please enter it below.
      </p>
      <div className="flex justify-between mb-4">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            ref={(ref) => inputs.current.push(ref)}
            maxLength="1"
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            className="w-12 h-12 text-center border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-lg"
          />
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-6">
        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <Check className="mr-2 h-5 w-5" />
          Verify OTP
        </button>
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">
          Time remaining:{" "}
          <span className="font-medium">
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </p>
      </div>
      {/* Resend OTP Button */}
      <div className="mt-4">
        <button
          onClick={handleResendOTP}
          disabled={timeLeft > 0}
          className={`w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white ${
            timeLeft > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
        >
          {timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : "Resend OTP"}
        </button>
      </div>
    </form>
  );
}
