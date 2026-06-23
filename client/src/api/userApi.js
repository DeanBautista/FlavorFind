  import axios from "axios";

  const apiBaseURL =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000/api";

  const apiClient = axios.create({
    baseURL: apiBaseURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,   // ← allows cookies (refreshToken) to be sent/received
  });

  // ── Request Interceptor ───────────────────────────────────────
  // Attach access token to every request automatically
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");  // ← renamed from "token"
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // ── Response Interceptor ──────────────────────────────────────
  // If access token is expired (401), silently get a new one and retry
    apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // No config means this never made it through the normal request lifecycle
      // (interceptor threw, request was canceled, etc.) — nothing to retry.
      if (!originalRequest) {
        return Promise.reject(error);
      }

      const is401 = error.response?.status === 401;
      const isRetry = originalRequest._retry;
      const isAuthRoute = originalRequest.url.includes("/login") ||
                          originalRequest.url.includes("/users");

      if (is401 && !isRetry && !isAuthRoute) {
        originalRequest._retry = true;

        try {
          const { data } = await apiClient.post("/users/refresh");
          const newAccessToken = data.accessToken;

          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          window.location.href = "/signin";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  // ── Auth Calls ────────────────────────────────────────────────
  export const createUser = async (userData) => {
    try {
      const response = await apiClient.post("/users/register", userData);
      const { accessToken, user } = response.data;  // ← renamed from token

      localStorage.setItem("accessToken", accessToken);  // ← save access token only
      return { accessToken, user };
    } catch (error) {
      const errorData = error.response?.data || { message: error.message };
      throw errorData;
    }
  };

  export const loginUser = async (userData) => {
    try {
      const response = await apiClient.post("/users/login", userData);
      const { accessToken, user } = response.data;  // ← renamed from token

      localStorage.setItem("accessToken", accessToken);  // ← save access token only
      return { accessToken, user };
    } catch (error) {
      const errorData = error.response?.data || { message: error.message };
      throw errorData;
    }
  };

  export const logoutUser = async () => {
    try {
      await apiClient.post("/users/logout");  // ← clears HttpOnly cookie on server
    } finally {
      localStorage.removeItem("accessToken");
      window.location.href = "/signin";
    }
  };

  export const updateUser = async (userId, userData) => {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || { message: error.message };
      throw errorData;
    }
  };

  export const getUserRecipes = async (userId) => {
    try {
      const { data } = await apiClient.get("/recipes", { params: { author: userId } });
      return Array.isArray(data) ? data : data.recipes || [];
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  };

  export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await apiClient.post("/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data; // { url, publicId }
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  };

  export default apiClient;
