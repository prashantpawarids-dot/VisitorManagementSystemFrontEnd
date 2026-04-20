import { apiClient } from "./client";
import type { LoginRequest, LoginResponse } from "@/features/auth/types";
import { normalizeAuthUser } from "@/lib/auth";

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post("/api/Auth/login", payload);
    return normalizeAuthUser(data);
  },
};
