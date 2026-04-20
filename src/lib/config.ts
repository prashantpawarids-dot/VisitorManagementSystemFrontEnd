// export const config = {
//   // apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:7157",
//   apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "https://localhost:7157",
//   defaultHostId: Number(import.meta.env.VITE_DEFAULT_HOST_ID || 2),
//   defaultBranchId: Number(import.meta.env.VITE_DEFAULT_BRANCH_ID || 1),
//   defaultGateId: Number(import.meta.env.VITE_DEFAULT_GATE_ID || 1),
//   appName: "IDS Visitor Management",
//   companyName: "IDSID PVT LTD",
// } as const;


export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "https://localhost:7157",
  defaultHostId: Number(import.meta.env.VITE_DEFAULT_HOST_ID || 2),
  defaultBranchId: Number(import.meta.env.VITE_DEFAULT_BRANCH_ID || 1),
  defaultGateId: Number(import.meta.env.VITE_DEFAULT_GATE_ID || 1),
  appName: "IDS Visitor Management",
  companyName: "IDSID PVT LTD",
} as const;