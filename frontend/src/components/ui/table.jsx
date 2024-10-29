import React from "react";

export const Table = ({ className, ...props }) => (
  <div className="w-full overflow-auto">
    <table
      className={`w-full caption-bottom text-sm ${className}`}
      {...props}
    />
  </div>
);

export const TableHeader = ({ className, ...props }) => (
  <thead className={className} {...props} />
);

export const TableBody = ({ className, ...props }) => (
  <tbody className={className} {...props} />
);

export const TableRow = ({ className, ...props }) => (
  <tr
    className={`border-b transition-colors hover:bg-gray-100 ${className}`}
    {...props}
  />
);

export const TableHead = ({ className, ...props }) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-gray-500 ${className}`}
    {...props}
  />
);

export const TableCell = ({ className, ...props }) => (
  <td className={`p-4 align-middle ${className}`} {...props} />
);
