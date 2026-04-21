import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { gateScansApi } from "@/services/api/gateScans";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Users, RefreshCw, MapPin } from "lucide-react";

// ✅ Lazy load to fix "window is not defined" error
const LiveMap = lazy(() =>
  import("@/components/common/LiveMap").then((m) => ({ default: m.LiveMap }))
);

export const Route = createFileRoute("/_app/tracking/live-inside")({
  component: LiveInsidePage,
});

function LiveInsidePage() {
  const { data, isLoading, refetch, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["live-inside"],
    queryFn: () => gateScansApi.getLiveLocations(),
    refetchInterval: 10000,
  });

  const visitorsWithLocation = data?.filter((v: any) => v.location) ?? [];

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Live Inside</h1>
          <p className="text-sm text-muted-foreground">
            Real-time visitor locations across all gates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dataUpdatedAt > 0 && (
            <p className="text-xs text-muted-foreground">
              Updated:{" "}
              {new Date(dataUpdatedAt).toLocaleTimeString("en-IN", {
                hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
              })}
            </p>
          )}
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card className="border-border/60">
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-5 w-5 text-success" />
            <div>
              <p className="text-xl font-bold">{data?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Total Inside</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="flex items-center gap-3 p-4">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xl font-bold">{visitorsWithLocation.length}</p>
              <p className="text-xs text-muted-foreground">Sharing Location</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 col-span-2 sm:col-span-1">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
            </span>
            <span className="text-xs font-medium text-success">Live — refreshes every 10s</span>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Map */}
          {visitorsWithLocation.length > 0 ? (
            <Card className="overflow-hidden border-border/60">
              <CardContent className="p-0">
                <Suspense fallback={
                  <div className="flex h-[400px] items-center justify-center bg-muted/20">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                }>
                  <LiveMap visitors={visitorsWithLocation} />
                </Suspense>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/60">
              <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                <MapPin className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No visitors are sharing their location yet.
                </p>
                <p className="text-xs text-muted-foreground">
                  Visitors can share location from their QR approval page.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Table */}
          <Card className="border-border/60">
            <CardContent className="p-0">
              {!data || data.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No visitors currently inside.
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
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((v: any) => (
                        <tr key={v.id} className="border-b border-border/40 transition-colors hover:bg-muted/30">
                          <td className="px-4 py-3 font-medium">{v.visitorName}</td>
                          <td className="px-4 py-3 text-muted-foreground">{v.hostName}</td>
                          <td className="px-4 py-3 text-muted-foreground">{v.flatNumber}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">{v.visitorType}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            {v.location ? (
                              <span className="inline-flex items-center gap-1 text-xs text-success">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
                                Live ·{" "}
                                {new Date(v.location.updatedAt + "Z").toLocaleTimeString("en-IN", {
                                  hour: "2-digit", minute: "2-digit", hour12: true,
                                })}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Not sharing</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}