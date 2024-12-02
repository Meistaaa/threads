import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/(authentication)/auth/[...nextauth]/options";

// Create an instance of Axios
const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:3000", // Default API base URL
  timeout: 10000, // Optional: Set a timeout for requests
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to attach token to headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      throw new Error("User is not authenticated");
    }
    if (session) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 or 500
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      console.error("Unauthorized, redirecting to login...");
      // Optional: Redirect to login or clear user session
    }

    return Promise.reject(error);
  }
);

// Export the custom Axios instance as `axios`
export default axiosInstance as typeof axios;
