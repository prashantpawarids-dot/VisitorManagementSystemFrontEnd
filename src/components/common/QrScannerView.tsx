import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Loader2, VideoOff } from "lucide-react";

interface Props {
  onScan: (token: string) => void;
  active: boolean;
}

export function QrScannerView({ onScan, active }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active || !videoRef.current) return;

    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;

    reader
      .decodeFromVideoDevice(
        undefined, // use default camera
        videoRef.current,
        (result, err, controls) => {
          controlsRef.current = controls;
          if (result) {
            onScan(result.getText());
          }
        }
      )
      .then((controls) => {
        controlsRef.current = controls;
        setStarted(true);
      })
      .catch((err) => {
        console.error(err);
        setError("Camera access denied or not available.");
      });

    return () => {
      // ✅ Clean stop — no DOM conflicts with React
      controlsRef.current?.stop();
      controlsRef.current = null;
      readerRef.current = null;
      setStarted(false);
    };
  }, [active]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-8 text-center">
        <VideoOff className="h-8 w-8 text-destructive" />
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-border/60 bg-black">
        {/* ✅ React owns this video element — no DOM conflicts */}
        <video
          ref={videoRef}
          className="w-full"
          style={{ minHeight: "280px" }}
        />
        {!started && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="flex items-center gap-2 text-sm text-white">
              <Loader2 className="h-4 w-4 animate-spin" /> Starting camera…
            </div>
          </div>
        )}
        {started && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-48 w-48 rounded-lg border-2 border-white/70" />
          </div>
        )}
      </div>
      {started && (
        <p className="text-xs text-muted-foreground">
          Point camera at the QR code
        </p>
      )}
    </div>
  );
}