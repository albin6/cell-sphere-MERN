import React from "react";

export const Tabs = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const TabsList = ({ className, ...props }) => (
  <div
    className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}
    {...props}
  />
);

export const TabsTrigger = ({ className, ...props }) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm ${className}`}
    {...props}
  />
);

export const TabsContent = ({ className, ...props }) => (
  <div
    className={`mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${className}`}
    {...props}
  />
);
