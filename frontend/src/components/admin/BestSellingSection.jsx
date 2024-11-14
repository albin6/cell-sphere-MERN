import React from "react";

const BestSellingSection = ({ title, items }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="p-4 border-b">
      <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>
    </div>
    <div className="p-4">
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item._id}
            className="flex justify-between items-center text-sm"
          >
            <span className="font-medium truncate mr-2">{item.name}</span>
            <span className="font-semibold whitespace-nowrap">
              {item.quantity_sold || item.totalSold} units
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default BestSellingSection;
