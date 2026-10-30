import axios from "axios";
import { API_URL } from "./config";

// Render's free tier can take ~50s to wake up, so allow a generous timeout.
const client = axios.create({ baseURL: API_URL, timeout: 70000 });

export const fetchVideos = async (params = {}) => {
  const response = await client.get("/videos", { params });
  return response.data.videos || [];
};

export const fetchVideo = async (id) => {
  const response = await client.get(`/videos/${id}`);
  return response.data;
};

export const addView = (id) => client.patch(`/videos/${id}/views`);

export const vote = (id, type, change = "increase") =>
  client.patch(`/videos/${id}/votes`, { vote: type, change });

export const uploadVideo = async (data) => {
  const response = await client.post("/videos", data);
  return response.data;
};

export const errorMessage = (e) => {
  if (e && e.response && e.response.data && e.response.data.message) {
    return e.response.data.message;
  }
  if (e && e.code === "ECONNABORTED") {
    return "The server took too long to respond. Please try again.";
  }
  return "Something went wrong. Please check your connection and try again.";
};
