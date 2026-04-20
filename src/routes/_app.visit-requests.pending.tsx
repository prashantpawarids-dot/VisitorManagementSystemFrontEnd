import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { visitRequestsApi } from "@/services/api/visitRequests";
import { authStorage } from "@/services/api/client";

type ActionType = "approve" | "reject" | "resubmit";

interface ActionState {
  visitRequestId: number;
  type: ActionType;
  remarks: string;
}

const actionConfig = {
  approve:  { label: "Approve",              color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  reject:   { label: "Reject",               color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  resubmit: { label: "Request Resubmission", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
};

function PendingPage() {
  const qc = useQueryClient();
  const auth = authStorage.get() as any;
  const hostId = auth?.userId;

  const [action, setAction] = useState<ActionState | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pending-visit-requests", hostId],
    queryFn: () => visitRequestsApi.getPending(hostId),
    enabled: !!hostId,
  });

  const mutation = useMutation({
    mutationFn: ({ id, type, remarks }: { id: number; type: ActionType; remarks: string }) => {
      const body = { approvedBy: hostId, remarks };
      if (type === "approve") return visitRequestsApi.approve(id, body);
      if (type === "reject")  return visitRequestsApi.reject(id, body);
      return visitRequestsApi.requestResubmission(id, body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pending-visit-requests"] });
      setAction(null);
    },
  });

  const requests = Array.isArray(data) ? data : [];

  return (
    <div style={{ padding: "24px", maxWidth: "760px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>
        Pending Requests
      </h1>
      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
        Approve, reject, or request resubmission of incoming visitor requests.
      </p>

      {isLoading && <p style={{ color: "#64748b" }}>Loading...</p>}
      {isError   && <p style={{ color: "#dc2626" }}>Failed to load requests.</p>}

      {!isLoading && requests.length === 0 && (
        <div style={{ background: "#fff", borderRadius: "12px", padding: "48px", border: "1px solid #e2e8f0", textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
          <p style={{ color: "#64748b", fontWeight: 500 }}>No pending requests</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {requests.map((item: any) => {
          const isExpanded = action?.visitRequestId === item.id;
          return (
            <div key={item.id} style={{
              background: "#fff", borderRadius: "12px",
              border: "1px solid #e2e8f0", overflow: "hidden",
              boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
            }}>
              {/* Visitor Info */}
              <div style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontWeight: 700, fontSize: "16px", color: "#0f172a" }}>
                    {item.visitorName ?? "—"}
                  </span>
                  <span style={{
                    fontSize: "11px", fontWeight: 700, padding: "2px 10px", borderRadius: "99px",
                    background: "#fef9c3", color: "#854d0e", border: "1px solid #fde68a",
                  }}>PENDING</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px", fontSize: "13px", color: "#475569" }}>
                  <span>🏠 Flat {item.flatNumber}</span>
                  <span>👤 {item.hostName}</span>
                  <span>📋 {item.purpose}</span>
                  <span>🏷️ {item.visitorType}</span>
                  <span>📅 {new Date(item.visitDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {!isExpanded && (
                <div style={{
                  display: "flex", gap: "8px", padding: "10px 20px",
                  borderTop: "1px solid #f1f5f9", background: "#f8fafc",
                }}>
                  {(Object.keys(actionConfig) as ActionType[]).map((type) => {
                    const cfg = actionConfig[type];
                    return (
                      <button
                        key={type}
                        onClick={() => setAction({ visitRequestId: item.id, type, remarks: "" })}
                        style={{
                          padding: "6px 14px", borderRadius: "6px", fontSize: "13px", fontWeight: 500,
                          cursor: "pointer", border: `1px solid ${cfg.border}`,
                          background: cfg.bg, color: cfg.color,
                        }}
                      >{cfg.label}</button>
                    );
                  })}
                </div>
              )}

              {/* Inline Confirm Form */}
              {isExpanded && action && (
                <div style={{
                  padding: "14px 20px", borderTop: "1px solid #f1f5f9",
                  background: actionConfig[action.type].bg,
                }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: actionConfig[action.type].color, marginBottom: "8px" }}>
                    {actionConfig[action.type].label} — Remarks (optional)
                  </p>
                  <textarea
                    rows={2}
                    placeholder="Add a remark..."
                    value={action.remarks}
                    onChange={(e) => setAction({ ...action, remarks: e.target.value })}
                    style={{
                      width: "100%", padding: "8px 10px", borderRadius: "6px",
                      fontSize: "13px", border: "1px solid #cbd5e1",
                      resize: "none", outline: "none", boxSizing: "border-box",
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <button
                      onClick={() => mutation.mutate({ id: action.visitRequestId, type: action.type, remarks: action.remarks })}
                      disabled={mutation.isPending}
                      style={{
                        padding: "6px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: 700,
                        background: actionConfig[action.type].color, color: "#fff",
                        border: "none", cursor: mutation.isPending ? "not-allowed" : "pointer",
                        opacity: mutation.isPending ? 0.6 : 1,
                      }}
                    >{mutation.isPending ? "Submitting..." : "Confirm"}</button>
                    <button
                      onClick={() => setAction(null)}
                      style={{
                        padding: "6px 14px", borderRadius: "6px", fontSize: "13px",
                        background: "#fff", border: "1px solid #cbd5e1", color: "#475569", cursor: "pointer",
                      }}
                    >Cancel</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_app/visit-requests/pending")({
  component: PendingPage,
});