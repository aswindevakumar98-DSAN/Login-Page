
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function loginUser(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data.user;
}

export async function logoutUser() {
  const response = await api.post("/auth/logout");
  return response.data;
}
