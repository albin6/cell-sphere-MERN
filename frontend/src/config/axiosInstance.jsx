import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  const access_token = JSON.parse(localStorage.getItem("user_access_token"));

  if (access_token) {
    config.headers["Authorization"] = `Bearer ${access_token}`;
  }

  return config;
});
// ===========================================================================================================
axiosInstance.interceptors.response.use(
  (response) => {
    if (response?.data?.access_token) {
      localStorage.setItem(
        "user_access_token",
        JSON.stringify(response.data.access_token)
      );
      console.log("Access token set in local storage");
    }
    return response;
  },
  async (error) => {
    const original_request = error.config;

    if (
      error.response?.status === 403 &&
      error.response.data.message ===
        "Refresh token expired, please log in again." &&
      !original_request._retry
    ) {
      // Clear the local storage or cookies where tokens are stored
      localStorage.removeItem("user_access_token");
      localStorage.removeItem("userInfo");
      document.cookie =
        "user_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // Correct way to clear the cookie

      // Redirect the user to the login page
      window.location.href = "/login";

      return Promise.reject(error);
    }

    // Handle other cases, like trying to refresh the access token
    if (
      error.response?.status === 401 &&
      error.response.data.message === "Not authorized, token failed" &&
      !original_request._retry
    ) {
      original_request._retry = true;

      try {
        const response = await axiosInstance.post(
          "/api/users/token",
          {},
          {
            withCredentials: true,
          }
        );

        // Set the new Authorization header
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response?.data?.access_token}`;

        return axiosInstance(original_request); // Retry the original request
      } catch (error) {
        console.log("Error refreshing token:", error);
        return Promise.reject(error);
      }
    } else if (
      error.response?.status === 401 &&
      error.response.data.message === "No refresh token provided" &&
      !original_request._retry
    ) {
      // Clear the local storage or cookies where tokens are stored
      localStorage.removeItem("user_access_token");
      localStorage.removeItem("userInfo");

      // Redirect the user to the login page
      window.location.href = "/login";

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
// ===========================================================================================================

// --------------------------------------------------------------
// --------------------------------------------------------------

export const adminAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

adminAxiosInstance.interceptors.request.use(async (config) => {
  const admin_access_token = JSON.parse(
    localStorage.getItem("admin_access_token")
  );

  if (admin_access_token) {
    config.headers["Authorization"] = `Bearer ${admin_access_token}`;
  }
  return config;
});

adminAxiosInstance.interceptors.response.use(
  (response) => {
    if (response?.data?.access_token) {
      localStorage.setItem(
        "admin_access_token",
        JSON.stringify(response.data.access_token)
      );
      console.log("Access token set in local storage");
    }
    return response;
  },
  async (error) => {
    const original_request = error.config;

    if (
      error.response?.status === 403 &&
      error.response.data.message ===
        "Refresh token expired, please log in again." &&
      !original_request._retry
    ) {
      // Clear the local storage or cookies where tokens are stored
      localStorage.removeItem("admin_access_token");
      localStorage.removeItem("adminInfo");
      document.cookie =
        "admin_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // Correct way to clear the cookie

      // Redirect the user to the login page
      window.location.href = "/admin";

      return Promise.reject(error);
    }

    // Handle other cases, like trying to refresh the access token
    if (
      error.response?.status === 401 &&
      error.response.data.message === "Not authorized, token failed" &&
      !original_request._retry
    ) {
      original_request._retry = true;

      try {
        const response = await axiosInstance.post(
          "/api/admin/token",
          {},
          {
            withCredentials: true,
          }
        );

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response?.data?.access_token}`;

        return axiosInstance(original_request);
      } catch (error) {
        console.log("Error refreshing token:", error);
        return Promise.reject(error);
      }
    } else if (
      error.response?.status === 401 &&
      error.response.data.message === "No refresh token provided" &&
      !original_request._retry
    ) {
      // Clear the local storage or cookies where tokens are stored
      localStorage.removeItem("admin_access_token");
      localStorage.removeItem("adminInfo");

      // Redirect the user to the login page
      window.location.href = "/admin";

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
