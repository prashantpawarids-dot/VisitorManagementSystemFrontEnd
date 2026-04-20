import { apiClient } from "./client";

export const reportsApi = {
  getDailySummary: async () => {
    const { data } = await apiClient.get("/api/Reports/daily-summary");
    return data;
  },
  getHostWise: async () => {
    const { data } = await apiClient.get("/api/Reports/host-wise");
    return data;
  },
  getGateWise: async () => {
    const { data } = await apiClient.get("/api/Reports/gate-wise");
    return data;
  },
};