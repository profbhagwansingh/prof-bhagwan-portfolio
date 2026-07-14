import axios from "axios";

/**
 * API client.
 *
 * - In the browser  → baseURL is "" so /api/* hits the Next.js dev server,
 *   which rewrites the request to the NestJS backend (no CORS issues).
 * - On the server   → baseURL is the full backend URL so SSR fetch works.
 */
const isServer = typeof window === "undefined";

const api = axios.create({
  baseURL: isServer
    ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000")
    : "",          // ← relative: browser calls go through Next.js rewrites proxy
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token for admin routes (browser only)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
// Handle 401 Unauthorized errors (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
        if (window.location.pathname !== "/admin/login") {
          window.location.href = "/admin/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;