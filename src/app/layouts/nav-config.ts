import {
  LayoutDashboard,
  Users,
  ScrollText,
  ClipboardList,
  ScanLine,
  Activity,
  ShieldCheck,
  Inbox,
  CheckCircle2,
  History,
  LogIn,
  LogOut as LogOutIcon,
  QrCode,
  UserPlus,
  KeyRound,
  BarChart3,
} from "lucide-react";
import type { UserRole } from "@/features/auth/types";

export interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export function getNavForRoles(roles: UserRole[]): NavGroup[] {
  const groups: NavGroup[] = [];

  if (roles.includes("ADMIN")) {
    groups.push({
      label: "Overview",
      items: [{ to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
    });
    groups.push({
      label: "Operations",
      items: [
        { to: "/visit-requests/pending", label: "Visit Requests", icon: ClipboardList },
        { to: "/tracking/live-inside", label: "Live Inside", icon: Activity },
        { to: "/tracking/history", label: "History", icon: History },
      ],
    });
    groups.push({
      label: "Reports",
      items: [
        { to: "/reports/daily-summary", label: "Daily Summary", icon: BarChart3 },
        { to: "/reports/host-wise", label: "Host Wise", icon: BarChart3 },
        { to: "/reports/gate-wise", label: "Gate Wise", icon: BarChart3 },
      ],
    });
    groups.push({
      label: "Administration",
      items: [
        { to: "/users", label: "Users", icon: Users },
        { to: "/users/create", label: "Create User", icon: UserPlus },
      ],
    });
    return groups;
  }

  if (roles.includes("HOST")) {
    groups.push({
      label: "Overview",
      items: [{ to: "/host/dashboard", label: "Dashboard", icon: LayoutDashboard }],
    });
    groups.push({
      label: "Requests",
      items: [
        { to: "/visit-requests/pending", label: "Pending", icon: Inbox },
        { to: "/visit-requests/approved", label: "Approved", icon: CheckCircle2 },
        { to: "/tracking/history", label: "History", icon: History },
      ],
    });
    return groups;
  }

  if (roles.includes("SECURITY")) {
    groups.push({
      label: "Overview",
      items: [{ to: "/security/dashboard", label: "Dashboard", icon: LayoutDashboard }],
    });
    groups.push({
      label: "Gate",
      items: [
        { to: "/security/check-in", label: "Scan Entry", icon: LogIn },
        { to: "/security/check-out", label: "Scan Exit", icon: LogOutIcon },
        { to: "/security/qr-validate", label: "QR Validate", icon: QrCode },
      ],
    });
    groups.push({
      label: "Tracking",
      items: [
        { to: "/tracking/live-inside", label: "Live Inside", icon: Activity },
        { to: "/tracking/history", label: "History", icon: History },
      ],
    });
    return groups;
  }

  return groups;
}

// Re-export icons used elsewhere
export { ShieldCheck, ScanLine, ScrollText, KeyRound };
