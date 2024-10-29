import React from "react";

export default function SelectStatus({
  orderId,
  currentStatus,
  onStatusChange,
}) {
  const handleChange = (event) => {
    onStatusChange(orderId, event.target.value);
  };

  return (
    <div className="w-48">
      <label htmlFor={`status-select-${orderId}`} className="sr-only">
        Change order status
      </label>
      <select
        id={`status-select-${orderId}`}
        value={currentStatus}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm"
      >
        <option value="" disabled>
          Select new status
        </option>
        <option value="Pending">Pending</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
  );
}
