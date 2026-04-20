import { apiClient } from "./client";

export interface ApprovalPayload {
  approvedBy: number;
  remarks: string;
}

export const approvalsApi = {
  approve: async (visitRequestId: string | number, payload: ApprovalPayload) => {
    const { data } = await apiClient.post(`/api/Approvals/${visitRequestId}/approve`, payload);
    return data;
  },
  reject: async (visitRequestId: string | number, payload: ApprovalPayload) => {
    const { data } = await apiClient.post(`/api/Approvals/${visitRequestId}/reject`, payload);
    return data;
  },
  requestResubmission: async (visitRequestId: string | number, payload: ApprovalPayload) => {
    const { data } = await apiClient.post(`/api/Approvals/${visitRequestId}/request-resubmission`, payload);
    return data;
  },
};