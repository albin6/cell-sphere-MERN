import React from "react";

export const Alert = ({ className, variant = "default", ...props }) => {
  const baseStyle = "relative w-full rounded-lg border p-4";
  const variantStyles = {
    default: "bg-white text-gray-900 border-gray-200",
    destructive: "border-red-500 text-red-600 bg-red-50",
  };

  return (
    <div
      role="alert"
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
};

export const AlertTitle = ({ className, ...props }) => (
  <h5
    className={`mb-1 font-medium leading-none tracking-tight ${className}`}
    {...props}
  />
);

export const AlertDescription = ({ className, ...props }) => (
  <div className={`text-sm ${className}`} {...props} />
);
