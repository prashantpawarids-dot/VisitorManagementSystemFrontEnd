// import { createFileRoute } from "@tanstack/react-router";
// import { ComingSoonPage } from "@/components/common/ComingSoonPage";

// export const Route = createFileRoute("/_app/visit-requests/approved")({
//   component: () => (
//     <ComingSoonPage
//       title="Approved requests"
//       description="Visitors approved and ready to enter."
//     />
//   ),
// });




// approved.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { visitRequestsApi } from "@/services/api/visitRequests";
import { authStorage } from "@/services/api/client";

const PAGE_SIZE = 10;

const today = () => new Date().toISOString().split("T")[0];

function ApprovedPage() {
  const auth = authStorage.get() as any;
  const isAdmin = auth?.roles?.some((r: string) => r.toLowerCase() === "admin");
  const hostId = isAdmin ? undefined : auth?.userId;

  const [date, setDate] = useState<string>(today());
  const [page, setPage] = useState(1);
  const printRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["approved-visit-requests", hostId, date],
    queryFn: () => visitRequestsApi.getApproved(hostId, date),
  });

  const requests = Array.isArray(data) ? data : [];
  const totalPages = Math.ceil(requests.length / PAGE_SIZE);
  const paginated = requests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    const win = window.open("", "_blank");
    if (!win || !content) return;
    win.document.write(`
      <html><head><title>Approved Requests - ${date}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
        h2 { margin-bottom: 4px; }
        p { color: #64748b; font-size: 13px; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { background: #f1f5f9; padding: 10px 12px; text-align: left; border-bottom: 2px solid #e2e8f0; }
        td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
        tr:hover td { background: #f8fafc; }
        .badge { display:inline-block; padding: 2px 8px; border-radius: 99px;
                 background: #f0fdf4; color: #15803d; font-size: 11px; font-weight: 700; }
      </style></head><body>${content}</body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
            Approved Requests
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
            {isAdmin ? "All approved visitors" : "Your approved visitors"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setPage(1); }}
            style={{
              padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0",
              fontSize: "13px", color: "#0f172a", background: "#fff", cursor: "pointer",
              outline: "none",
            }}
          />
          <button
            onClick={handlePrint}
            disabled={requests.length === 0}
            style={{
              padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
              background: requests.length === 0 ? "#f1f5f9" : "#0f172a",
              color: requests.length === 0 ? "#94a3b8" : "#fff",
              border: "none", cursor: requests.length === 0 ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            ⬇ Export PDF
          </button>
        </div>
      </div>

      {/* States */}
      {isLoading && (
        <div style={{ textAlign: "center", padding: "48px", color: "#64748b" }}>Loading...</div>
      )}
      {isError && (
        <div style={{ textAlign: "center", padding: "48px", color: "#dc2626" }}>Failed to load requests.</div>
      )}

      {!isLoading && !isError && requests.length === 0 && (
        <div style={{
          background: "#fff", borderRadius: "12px", padding: "48px",
          border: "1px solid #e2e8f0", textAlign: "center",
        }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>📋</div>
          <p style={{ color: "#64748b", fontWeight: 500 }}>No approved requests for {new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && paginated.length > 0 && (
        <div ref={printRef}>
          <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "4px" }}>
            Approved Visitor Requests
          </h2>
          <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px" }}>
            Date: {new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            {" · "}{requests.length} record{requests.length !== 1 ? "s" : ""}
          </p>

          <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Visitor Name", "Flat", "Host", "Purpose", "Type", "Visit Date", "Status"].map((h) => (
                    <th key={h} style={{
                      padding: "12px 16px", textAlign: "left", fontWeight: 600,
                      color: "#475569", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((item: any, idx: number) => (
                  <tr
                    key={item.id}
                    style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                  >
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#0f172a" }}>
                      {item.visitorName}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#475569" }}>{item.flatNumber}</td>
                    <td style={{ padding: "12px 16px", color: "#475569" }}>{item.hostName}</td>
                    <td style={{ padding: "12px 16px", color: "#475569" }}>{item.purpose}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "2px 8px", borderRadius: "99px", fontSize: "11px", fontWeight: 600,
                        background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe",
                      }}>
                        {item.visitorType}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#475569", whiteSpace: "nowrap" }}>
                      {new Date(item.visitDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "2px 8px", borderRadius: "99px", fontSize: "11px", fontWeight: 600,
                        background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0",
                      }}>
                        APPROVED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                Page {page} of {totalPages} · {requests.length} total
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "6px 14px", borderRadius: "6px", fontSize: "13px",
                    border: "1px solid #e2e8f0", background: page === 1 ? "#f8fafc" : "#fff",
                    color: page === 1 ? "#94a3b8" : "#0f172a", cursor: page === 1 ? "not-allowed" : "pointer",
                  }}
                >← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      padding: "6px 12px", borderRadius: "6px", fontSize: "13px",
                      border: "1px solid #e2e8f0",
                      background: page === p ? "#0f172a" : "#fff",
                      color: page === p ? "#fff" : "#0f172a",
                      cursor: "pointer", fontWeight: page === p ? 700 : 400,
                    }}
                  >{p}</button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: "6px 14px", borderRadius: "6px", fontSize: "13px",
                    border: "1px solid #e2e8f0", background: page === totalPages ? "#f8fafc" : "#fff",
                    color: page === totalPages ? "#94a3b8" : "#0f172a",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                  }}
                >Next →</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/_app/visit-requests/approved")({
  component: ApprovedPage,
});