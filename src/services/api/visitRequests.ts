import { apiClient } from "./client";

export const visitRequestsApi = {
  getPending: async (hostId?: number) => {
    const { data } = await apiClient.get("/api/VisitRequests/pending", {
      params: hostId ? { hostId } : undefined,
    });
    return data;
  },

  getApproved: async (hostId?: number, date?: string) => {
    const { data } = await apiClient.get("/api/VisitRequests/approved", {
      params: {
        ...(hostId ? { hostId } : {}),
        ...(date ? { date } : {}),
      },
    });
    return data;
  },

  getReadyForEntry: async () => {
    const { data } = await apiClient.get("/api/VisitRequests/ready-for-entry");
    return data;
  },

  getById: async (id: string | number) => {
    const { data } = await apiClient.get(`/api/VisitRequests/${id}`);
    return data;
  },

  approve: async (visitRequestId: number, body: { approvedBy: number; remarks: string }) => {
    const { data } = await apiClient.post(`/api/Approvals/${visitRequestId}/approve`, body);
    return data;
  },

  reject: async (visitRequestId: number, body: { approvedBy: number; remarks: string }) => {
    const { data } = await apiClient.post(`/api/Approvals/${visitRequestId}/reject`, body);
    return data;
  },

  requestResubmission: async (visitRequestId: number, body: { approvedBy: number; remarks: string }) => {
    const { data } = await apiClient.post(`/api/Approvals/${visitRequestId}/request-resubmission`, body);
    return data;
  },
};