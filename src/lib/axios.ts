import axios from "axios";

// Storing CSRF token in memory so it automatically cleans up on page reload or navigation
let csrfToken: string | null = null;

// Axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies to be sent with requests
});

// Fetch CSRF token from server
const fetchCsrfToken = async (): Promise<string | null> => {
  try {
    const response = await api.get("/api/csrf");
    csrfToken = response.data.csrf_token;
    return csrfToken;
  } catch (err) {
    console.error("Failed to fetch CSRF token", err);
    return null;
  }
};

api.interceptors.request.use(
  async (config) => {
    const method = config.method?.toLowerCase();
    if (["post", "put", "delete"].includes(method || "")) {
      if (!csrfToken) {
        await fetchCsrfToken(); // Fetch if not cached
      }
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
