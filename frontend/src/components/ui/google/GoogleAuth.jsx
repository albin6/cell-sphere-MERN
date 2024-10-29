import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../../redux/Slices/userSlice";
import { axiosInstance } from "../../../config/axiosInstance";

const GoogleAuth = ({ setError }) => {
  const dispatch = useDispatch();
  const clientId =
    "447481056732-4t1390i8fon4qu3k94416jqrv2o4vmsk.apps.googleusercontent.com";

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google login success:", credentialResponse);

    // Send credential to backend
    try {
      const response = await axiosInstance.post("/google-auth", {
        credential: credentialResponse.credential, // The credential token from Google
        client_id: clientId,
      });

      // Handle response (you can save tokens or user data if needed)
      console.log("Backend response:", response.data);
      localStorage.setItem(
        "user_access_token",
        JSON.stringify(response?.data?.access_token)
      );
      dispatch(setUserDetails(response.data.user)); // Store user details in Redux
    } catch (error) {
      if (error?.response) {
        setError(error?.response?.data?.message);
      }
      console.error("Error sending credential to backend:", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
