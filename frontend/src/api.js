// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔐 Attach token properly (IMPORTANT FIX)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`; // ✅ FIXED
  }

  return req;
});

// 🔥 OPTIONAL (but VERY useful)
// auto logout if token is invalid/expired
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      window.location.reload(); // force logout
    }
    return Promise.reject(err);
  }
);

export default API;