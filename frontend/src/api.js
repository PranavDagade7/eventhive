
import axios from "axios";

const API = axios.create({
  baseURL: "https://eventhive-2f0q.onrender.com"
});

// Automatically attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
