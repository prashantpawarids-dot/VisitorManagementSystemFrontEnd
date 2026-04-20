import axios, { type AxiosInstance, AxiosError } from "axios";
import { config } from "@/lib/config";

const STORAGE_KEY = "ids_vms_auth";

export const authStorage = {
  get(): { token: string } | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(value: unknown) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  },
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

apiClient.interceptors.request.use((req) => {
  const auth = authStorage.get();
  if (auth?.token) {
    req.headers = req.headers ?? {};
    (req.headers as Record<string, string>).Authorization = `Bearer ${auth.token}`;
  }
  return req;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      authStorage.clear();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; title?: string } | undefined;
    return data?.message || data?.title || err.message || "Request failed";
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
