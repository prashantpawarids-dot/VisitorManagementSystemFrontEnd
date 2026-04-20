import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { gateScansApi } from "@/services/api/gateScans";
import { QrScannerView } from "@/components/common/QrScannerView";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ScanLine } from "lucide-react";

export const Route = createFileRoute("/_app/security/check-in")({
  component: CheckInPage,
});

function CheckInPage() {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    checkInTime?: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: (qrToken: string) =>
      gateScansApi.checkIn({ qrToken, gateId: 1 }),
    onSuccess: (data) => {
      setResult({ success: true, message: data.message, checkInTime: data.checkInTime });
      setScanning(false);
    },
    onError: (err: any) => {
      setResult({
        success: false,
        message: err?.response?.data || "Check-in failed.",
      });
      setScanning(false);
    },
  });

  const handleScan = (token: string) => {
    if (scanned || mutation.isPending) return;
    setScanned(true);
    mutation.mutate(token);
  };

  const handleReset = () => {
    setResult(null);
    setScanned(false);
    setScanning(false);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Scan Entry</h1>
        <p className="text-sm text-muted-foreground">Scan visitor QR pass to check in.</p>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-6 space-y-6">

          {result && (
            <div className={`flex flex-col items-center gap-3 rounded-xl p-6 text-center ${
              result.success ? "bg-success/10" : "bg-destructive/10"
            }`}>
              {result.success
                ? <CheckCircle2 className="h-10 w-10 text-success" />
                : <XCircle className="h-10 w-10 text-destructive" />}
              <p className="text-lg font-semibold">
                {result.success ? "Checked In!" : "Failed"}
              </p>
              <p className="text-sm text-muted-foreground">{result.message}</p>
              {result.checkInTime && (
                <p className="text-xs text-muted-foreground">
                  Time: {new Date(result.checkInTime).toLocaleTimeString()}
                </p>
              )}
            </div>
          )}

          {scanning && !result && (
            <QrScannerView onScan={handleScan} active={scanning} />
          )}

          {!scanning && !result && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <ScanLine className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Press start to scan visitor QR</p>
            </div>
          )}

          <div className="flex justify-center gap-3">
            {!result && !scanning && (
              <Button onClick={() => { setScanning(true); setScanned(false); }}>
                <ScanLine className="mr-2 h-4 w-4" /> Start Scanning
              </Button>
            )}
            {(result || scanning) && (
              <Button variant="outline" onClick={handleReset}>
                Scan Another
              </Button>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}