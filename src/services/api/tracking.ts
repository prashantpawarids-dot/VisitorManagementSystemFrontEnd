import { apiClient } from "./client";

export const trackingApi = {
  getLiveInside: async () => {
    const { data } = await apiClient.get("/api/Tracking/live-inside");
    return data;
  },
  getHistory: async () => {
    const { data } = await apiClient.get("/api/Tracking/history");
    return data;
  },
};