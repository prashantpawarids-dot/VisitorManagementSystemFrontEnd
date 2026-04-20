import { apiClient } from "./client";

export interface GateScanPayload {
  qrToken: string;
  gateId: number;
}

export interface ManualGatePayload {
  visitRequestId: number;
  gateId: number;
}

export const gateScansApi = {
  validateQr: async (qrToken: string) => {
    const { data } = await apiClient.get(`/api/Qr/validate/${encodeURIComponent(qrToken)}`);
    return data;
  },
  checkIn: async (payload: GateScanPayload) => {
    const { data } = await apiClient.post("/api/GateScans/check-in", payload);
    return data;
  },
  checkOut: async (payload: GateScanPayload) => {
    const { data } = await apiClient.post("/api/GateScans/check-out", payload);
    return data;
  },
  manualEntry: async (payload: ManualGatePayload) => {
    const { data } = await apiClient.post("/api/GateScans/manual-entry", payload);
    return data;
  },
  manualExit: async (payload: ManualGatePayload) => {
    const { data } = await apiClient.post("/api/GateScans/manual-exit", payload);
    return data;
  },
  getHistory: async (from?: string, to?: string) => {
  const params = new URLSearchParams();
  if (from) params.append("from", from);
  if (to) params.append("to", to);
  const { data } = await apiClient.get(`/api/Security/history?${params.toString()}`);
  return data;
},
};