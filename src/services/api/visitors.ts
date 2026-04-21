import { apiClient } from "./client";

export interface VisitorRequestPayload {
  firstName: string;
  middleName?: string;
  lastName: string;
  mobile: string;
  companyName?: string;
  hostId: number;
  branchId: number;
  purpose: string;
  hostName: string;
  flatNumber: string;
  visitingTo: string;
  visitorType: string;
  visitDate: string;
  photoUrl?: string;
}

export const visitorsApi = {
  submitRequest: async (payload: VisitorRequestPayload) => {
    const { data } = await apiClient.post("/api/Visitors/submit-request", payload);
    return data;
  },

  getStatus: async (visitRequestId: number) => {
    const { data } = await apiClient.get(`/api/Visitors/status/${visitRequestId}`);
    return data;
  },

  updateLocation: async (visitRequestId: number, latitude: number, longitude: number) => {
  const { data } = await apiClient.post("/api/Location/update", {
    visitRequestId, latitude, longitude
  });
  return data;
},
};