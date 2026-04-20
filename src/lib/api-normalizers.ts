import type { UserRole } from "@/features/auth/types";

type RecordLike = Record<string, unknown>;

export interface VisitRequestRecord {
  id: string;
  visitorName: string;
  mobile: string;
  companyName: string;
  hostName: string;
  flatNumber: string;
  purpose: string;
  visitingTo: string;
  visitorType: string;
  photoUrl: string;
  visitDate: string;
  status: string;
  remarks: string;
  qrToken: string;
}

export interface TrackingRecord {
  id: string;
  visitorName: string;
  hostName: string;
  flatNumber: string;
  mobile: string;
  visitorType: string;
  gateName: string;
  status: string;
  checkInAt: string;
  checkOutAt: string;
  visitDate: string;
}

export interface UserRecord {
  id: string;
  fullName: string;
  username: string;
  email: string;
  mobile: string;
  role: UserRole | "";
  status: string;
}

export interface ReportRow {
  id: string;
  label: string;
  total: number;
  approved: number;
  rejected: number;
  checkedIn: number;
  checkedOut: number;
  inside: number;
}

export interface ValidationRecord {
  visitorName: string;
  hostName: string;
  flatNumber: string;
  purpose: string;
  visitorType: string;
  visitDate: string;
  status: string;
  qrToken: string;
  message: string;
  isValid: boolean;
  photoUrl: string;
}

export function toRecord(value: unknown): RecordLike {
  return typeof value === "object" && value !== null ? (value as RecordLike) : {};
}

export function toArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function pickString(source: RecordLike, keys: string[]): string {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}

export function pickNumber(source: RecordLike, keys: string[]): number {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
}

export function pickBoolean(source: RecordLike, keys: string[]): boolean {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    if (typeof value === "number") return value > 0;
  }
  return false;
}

export function extractCollection<T = unknown>(input: unknown, extraKeys: string[] = []): T[] {
  if (Array.isArray(input)) return input as T[];
  const source = toRecord(input);
  const candidates = [
    ...extraKeys,
    "items",
    "data",
    "result",
    "results",
    "records",
    "rows",
    "requests",
    "visitors",
    "users",
    "history",
  ];

  for (const key of candidates) {
    const value = source[key];
    if (Array.isArray(value)) return value as T[];
    const nested = toRecord(value);
    for (const nestedKey of ["items", "data", "result", "results", "rows"]) {
      if (Array.isArray(nested[nestedKey])) return nested[nestedKey] as T[];
    }
  }

  return [];
}

function getStatus(raw: string): string {
  const normalized = raw.trim().toLowerCase();
  if (normalized.includes("approve")) return "approved";
  if (normalized.includes("reject")) return "rejected";
  if (normalized.includes("check in") || normalized.includes("checkedin") || normalized.includes("inside")) return "checked-in";
  if (normalized.includes("check out") || normalized.includes("checkedout") || normalized.includes("completed")) return "checked-out";
  if (normalized.includes("expire")) return "expired";
  if (normalized.includes("resubmit")) return "warning";
  if (normalized.includes("pending")) return "pending";
  return normalized || "info";
}

function joinName(parts: string[]) {
  return parts.filter(Boolean).join(" ").trim();
}

export function formatDateTime(value: string, fallback = "—") {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateOnly(value: string, fallback = "—") {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function normalizeVisitRequest(raw: unknown): VisitRequestRecord {
  const source = toRecord(raw);
  return {
    id: pickString(source, ["visitRequestId", "id", "requestId", "visitorId"]) || crypto.randomUUID(),
    visitorName:
      pickString(source, ["visitorName", "fullName", "name"]) ||
      joinName([
        pickString(source, ["firstName"]),
        pickString(source, ["middleName"]),
        pickString(source, ["lastName"]),
      ]) ||
      "Visitor",
    mobile: pickString(source, ["mobile", "phone", "phoneNumber"]),
    companyName: pickString(source, ["companyName", "company", "organization"]),
    hostName: pickString(source, ["hostName", "approvedByName", "residentName"]),
    flatNumber: pickString(source, ["flatNumber", "unitNumber", "flatNo"]),
    purpose: pickString(source, ["purpose", "reason", "visitPurpose"]),
    visitingTo: pickString(source, ["visitingTo", "meetingWith", "whomToMeet"]),
    visitorType: pickString(source, ["visitorType", "type", "visitorCategory"]),
    photoUrl: pickString(source, ["photoUrl", "photo", "imageUrl", "selfieUrl"]),
    visitDate: pickString(source, ["visitDate", "expectedVisitDate", "date", "createdAt"]),
    status: getStatus(pickString(source, ["status", "requestStatus", "approvalStatus"])),
    remarks: pickString(source, ["remarks", "comment", "note"]),
    qrToken: pickString(source, ["qrToken", "token", "qrCode"]),
  };
}

export function normalizeTrackingRecord(raw: unknown): TrackingRecord {
  const source = toRecord(raw);
  return {
    id: pickString(source, ["visitRequestId", "id", "trackingId"]) || crypto.randomUUID(),
    visitorName:
      pickString(source, ["visitorName", "fullName", "name"]) ||
      joinName([
        pickString(source, ["firstName"]),
        pickString(source, ["middleName"]),
        pickString(source, ["lastName"]),
      ]) ||
      "Visitor",
    hostName: pickString(source, ["hostName", "residentName"]),
    flatNumber: pickString(source, ["flatNumber", "unitNumber"]),
    mobile: pickString(source, ["mobile", "phone"]),
    visitorType: pickString(source, ["visitorType", "type"]),
    gateName: pickString(source, ["gateName", "gate", "entryGate"]),
    status: getStatus(pickString(source, ["status", "scanStatus"])),
    checkInAt: pickString(source, ["checkInTime", "checkedInAt", "inTime"]),
    checkOutAt: pickString(source, ["checkOutTime", "checkedOutAt", "outTime"]),
    visitDate: pickString(source, ["visitDate", "date", "createdAt"]),
  };
}

export function normalizeUser(raw: unknown): UserRecord {
  const source = toRecord(raw);
  const roleRaw = pickString(source, ["roleCode", "role", "roleName"]);
  const role = (["ADMIN", "HOST", "SECURITY"] as const).find((item) => item === roleRaw.toUpperCase()) ?? "";

  return {
    id: pickString(source, ["id", "userId", "staffId"]) || crypto.randomUUID(),
    fullName: pickString(source, ["fullName", "name"]) || "Unknown user",
    username: pickString(source, ["username", "userName"]),
    email: pickString(source, ["email"]),
    mobile: pickString(source, ["mobile", "phone"]),
    role,
    status: getStatus(pickString(source, ["status", "accountStatus"])) || "info",
  };
}

export function normalizeReportRow(raw: unknown, fallbackLabel: string): ReportRow {
  const source = toRecord(raw);
  return {
    id: pickString(source, ["id", "date", "hostName", "gateName", "label"]) || crypto.randomUUID(),
    label: pickString(source, ["label", "date", "hostName", "gateName", "name"]) || fallbackLabel,
    total: pickNumber(source, ["total", "totalVisitors", "count", "visits"]),
    approved: pickNumber(source, ["approved", "approvedRequests"]),
    rejected: pickNumber(source, ["rejected", "rejectedRequests"]),
    checkedIn: pickNumber(source, ["checkedIn", "checkedInToday", "entries"]),
    checkedOut: pickNumber(source, ["checkedOut", "checkedOutToday", "exits"]),
    inside: pickNumber(source, ["inside", "insideVisitors"]),
  };
}

export function normalizeValidation(raw: unknown): ValidationRecord {
  const source = toRecord(raw);
  return {
    visitorName:
      pickString(source, ["visitorName", "fullName", "name"]) ||
      joinName([
        pickString(source, ["firstName"]),
        pickString(source, ["middleName"]),
        pickString(source, ["lastName"]),
      ]) ||
      "Visitor",
    hostName: pickString(source, ["hostName", "residentName"]),
    flatNumber: pickString(source, ["flatNumber", "unitNumber"]),
    purpose: pickString(source, ["purpose", "reason"]),
    visitorType: pickString(source, ["visitorType", "type"]),
    visitDate: pickString(source, ["visitDate", "expectedVisitDate", "date"]),
    status: getStatus(pickString(source, ["status", "requestStatus", "approvalStatus"])),
    qrToken: pickString(source, ["qrToken", "token"]),
    message: pickString(source, ["message", "remarks", "statusMessage"]),
    isValid: pickBoolean(source, ["isValid", "valid", "success"]),
    photoUrl: pickString(source, ["photoUrl", "photo", "imageUrl"]),
  };
}