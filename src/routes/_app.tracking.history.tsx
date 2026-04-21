import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gateScansApi } from "@/services/api/gateScans";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Users } from "lucide-react";

export const Route = createFileRoute("/_app/tracking/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const today = new Date().toISOString().split("T")[0];
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [applied, setApplied] = useState({ from: today, to: today });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["security-history", applied.from, applied.to],
    queryFn: () => gateScansApi.getHistory(applied.from, applied.to),
  });

  const handleSearch = () => {
    setApplied({ from, to });
    refetch();
  };

  const statusColor: Record<string, string> = {
    CheckedIn: "bg-success/15 text-success",
    CheckedOut: "bg-muted text-muted-foreground",
    Approved: "bg-primary/10 text-primary",
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Visitor History</h1>
        <p className="text-sm text-muted-foreground">View all check-in and check-out records.</p>
      </div>

      {/* Filter Bar */}
      <Card className="border-border/60">
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">From</p>
            <Input
              type="date"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">To</p>
            <Input
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
              className="w-40"
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>

          {/* Total count */}
          {data && (
            <div className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span><strong className="text-foreground">{data.total}</strong> records</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/60">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : data?.records?.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No records found for this date range.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Visitor</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Host</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Flat</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Check In</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Check Out</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.records?.map((row: any) => (
                    <tr
                      key={row.id}
                      className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{row.visitorName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.hostName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.flatNumber}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{row.visitorType}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.checkInTime
                          ? new Date(row.checkInTime + "Z").toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                          : "—"}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {row.checkOutTime
                          ? new Date(row.checkOutTime + "Z").toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[row.status] ?? "bg-muted text-muted-foreground"
                          }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}