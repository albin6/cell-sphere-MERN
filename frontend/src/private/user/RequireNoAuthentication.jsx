import React from "react";
import { useUserAuth } from "../../hooks/CustomHooks";
import { Navigate } from "react-router-dom";

function RequireNoAuthentication({ children }) {
  const user = useUserAuth();

  if (user) {
    return <Navigate to={"/"} />;
  }
  return children;
}

export default RequireNoAuthentication;
