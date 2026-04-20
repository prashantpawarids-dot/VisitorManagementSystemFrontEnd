import type { AuthUser, UserRole } from "@/features/auth/types";

type UnknownRecord = Record<string, unknown>;

const ROLE_ALIASES: Record<string, UserRole> = {
  ADMIN: "ADMIN",
  ADMINISTRATOR: "ADMIN",
  SUPERADMIN: "ADMIN",
  HOST: "HOST",
  RESIDENT: "HOST",
  OWNER: "HOST",
  USER: "HOST",
  SECURITY: "SECURITY",
  GATE: "SECURITY",
  GUARD: "SECURITY",
  GATESECURITY: "SECURITY",
  GATE_SECURITY: "SECURITY",
  SECURITYGUARD: "SECURITY",
};

function toRecord(value: unknown): UnknownRecord {
  return typeof value === "object" && value !== null ? (value as UnknownRecord) : {};
}

function toStringValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function toNumberValue(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function extractValue(source: UnknownRecord, keys: string[]): unknown {
  for (const key of keys) {
    if (key in source && source[key] != null) return source[key];
  }
  return undefined;
}

function normalizeRole(value: unknown): UserRole | null {
  const raw = toStringValue(value)
    .trim()
    .replace(/^ROLE[_\s-]*/i, "")
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase();

  if (!raw) return null;
  return ROLE_ALIASES[raw] ?? null;
}

function extractRoles(source: UnknownRecord): UserRole[] {
  const directRoles = extractValue(source, ["roles", "roleCodes", "userRoles", "authorities"]);
  const singleRole = extractValue(source, ["role", "roleCode", "roleName", "userRole"]);

  const rawValues = Array.isArray(directRoles)
    ? directRoles
    : directRoles != null
      ? [directRoles]
      : singleRole != null
        ? [singleRole]
        : [];

  const normalized = rawValues
    .flatMap((item) => {
      if (typeof item === "string" || typeof item === "number") return [item];
      const record = toRecord(item);
      return [
        extractValue(record, ["role", "roleCode", "name", "code", "authority"]),
      ].filter(Boolean);
    })
    .map((item) => normalizeRole(item))
    .filter((item): item is UserRole => Boolean(item));

  return Array.from(new Set(normalized));
}

export function normalizeAuthUser(input: unknown): AuthUser {
  const source = toRecord(input);
  const nested = toRecord(extractValue(source, ["data", "result", "user"]));

  const token = toStringValue(
    extractValue(source, ["token", "accessToken", "jwt", "jwtToken"]) ??
      extractValue(nested, ["token", "accessToken", "jwt", "jwtToken"]),
  );

  const fullName =
    toStringValue(extractValue(source, ["fullName", "name", "displayName"])) ||
    toStringValue(extractValue(nested, ["fullName", "name", "displayName"])) ||
    [
      toStringValue(extractValue(source, ["firstName"])),
      toStringValue(extractValue(source, ["lastName"])),
    ]
      .filter(Boolean)
      .join(" ") ||
    "User";

  const username =
    toStringValue(extractValue(source, ["username", "userName", "email"])) ||
    toStringValue(extractValue(nested, ["username", "userName", "email"])) ||
    fullName;

  const userId =
    toNumberValue(extractValue(source, ["userId", "id", "staffId"])) ||
    toNumberValue(extractValue(nested, ["userId", "id", "staffId"]));

  const roles = extractRoles(source).length ? extractRoles(source) : extractRoles(nested);

  return {
    token,
    userId,
    fullName,
    username,
    roles,
  };
}