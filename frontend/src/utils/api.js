import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // remove /api
});

// Attach token automatically when available
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const parsed = JSON.parse(userInfo);
    req.headers.Authorization = `Bearer ${parsed.token}`;
  }
  return req;
});

export default API;
