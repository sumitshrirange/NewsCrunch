import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/* ── Request: attach access token ──────────────────────── */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ── Response: silent token refresh on 401 TOKEN_EXPIRED ── */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token),
  );
  failedQueue = [];
};

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const data = error.response?.data;

    if (
      error.response?.status === 401 &&
      data?.code === "TOKEN_EXPIRED" &&
      !original._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) =>
          failedQueue.push({ resolve, reject }),
        ).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return API(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data: rd } = await API.post("/auth/refresh");
        localStorage.setItem("accessToken", rd.accessToken);
        processQueue(null, rd.accessToken);
        original.headers.Authorization = `Bearer ${rd.accessToken}`;
        return API(original);
      } catch (err) {
        processQueue(err);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

/* ── Auth ─────────────────────────────────────────────── */
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const googleAuth = (credential) =>
  API.post("/auth/google", { credential });
export const logout = () => API.post("/auth/logout");
export const getMe = () => API.get("/auth/me");

/* ── Articles ─────────────────────────────────────────── */
export const summarizeUrl = (url, thumbnail = "") =>
  API.post("/articles/summarize", { url, thumbnail });
export const getArticles = (params) => API.get("/articles", { params });
export const getArticle = (id) => API.get(`/articles/${id}`);
export const deleteArticle = (id) => API.delete(`/articles/${id}`);
export const getStats = () => API.get("/articles/stats");

/* ── News feed ────────────────────────────────────────── */
export const getNewsFeed = (params) => API.get("/news", { params });
export const getTrendingNews = () => API.get("/news/trending");
