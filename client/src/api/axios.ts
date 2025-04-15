import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
