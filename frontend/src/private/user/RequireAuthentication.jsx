import React from "react";
import { useUserAuth } from "../../hooks/CustomHooks";
import { Navigate } from "react-router-dom";

function RequireAuthentication({ children }) {
  const user = useUserAuth();

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return children;
}

export default RequireAuthentication;
