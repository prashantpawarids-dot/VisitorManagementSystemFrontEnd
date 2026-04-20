import { apiClient } from "./client";

export interface CreateUserPayload {
  fullName: string;
  username: string;
  password: string;
  roleCode: "ADMIN" | "HOST" | "SECURITY";
  email: string;
  mobile: string;
}

export interface UpdatePasswordPayload {
  newPassword: string;
}

export const usersApi = {
  getUsers: async () => {
    const { data } = await apiClient.get("/api/Users");
    return data;
  },
  createUser: async (payload: CreateUserPayload) => {
    const { data } = await apiClient.post("/api/Users/create-user", payload);
    return data;
  },
  updatePassword: async (id: string | number, payload: UpdatePasswordPayload) => {
    const { data } = await apiClient.put(`/api/Users/${id}/update-password`, payload);
    return data;
  },
};