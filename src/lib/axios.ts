import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
