import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { Camera, ImagePlus, RefreshCcw, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SelfieCapture({
  value,
  onChange,
  disabled,
}: {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState("");

  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  // Attach the stream to the <video> element whenever either becomes available.
  // Because the <video> is rendered conditionally, we need to re-attach when the
  // dialog opens and the element mounts.
  useEffect(() => {
    if (cameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraOpen, stream]);

  const startCamera = async () => {
    setCameraError("");
    setCameraOpen(true); // open dialog FIRST so <video> mounts
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera API not supported in this browser. Please upload a photo instead.");
      return;
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Camera permission was denied. Allow access in your browser settings, or upload a photo."
          : "Could not start the camera. You can still upload a selfie image.";
      setCameraError(message);
    }
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    onChange(canvas.toDataURL("image/jpeg", 0.92));
    stopCamera();
    setCameraOpen(false);
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Card className="border-border/60 bg-muted/30 shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card">
              {value ? (
                <img src={value} alt="Visitor selfie preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
                  <Camera className="h-6 w-6" />
                  <span className="text-xs">No selfie yet</span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">Visitor selfie</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Capture a clear face photo for verification at the gate.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" onClick={startCamera} disabled={disabled}>
                  <Video className="h-4 w-4" /> {value ? "Retake with camera" : "Open camera"}
                </Button>
                <Button type="button" variant="outline" disabled={disabled} onClick={() => inputRef.current?.click()}>
                  <ImagePlus className="h-4 w-4" /> Upload image
                </Button>
                {value && (
                  <Button type="button" variant="ghost" disabled={disabled} onClick={() => onChange("")}>
                    <RefreshCcw className="h-4 w-4" /> Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleFile}
      />

      <Dialog
        open={cameraOpen}
        onOpenChange={(open) => {
          setCameraOpen(open);
          if (!open) stopCamera();
        }}
      >
        <DialogContent className="max-w-2xl border-border/60 bg-card">
          <DialogHeader>
            <DialogTitle>Capture visitor selfie</DialogTitle>
            <DialogDescription>Center the face and ensure good lighting before capturing.</DialogDescription>
          </DialogHeader>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
            {/* Always render the <video> so the ref is available before the stream attaches */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="aspect-[4/3] w-full bg-black object-cover"
              style={{ display: stream ? "block" : "none" }}
            />
            {!stream && (
              <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
                <VideoOff className="h-8 w-8" />
                <p className="max-w-sm text-sm">{cameraError || "Camera is starting…"}</p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => { setCameraOpen(false); stopCamera(); }}>
              Cancel
            </Button>
            <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
              Upload instead
            </Button>
            <Button type="button" onClick={capture} disabled={!stream}>
              <Camera className="h-4 w-4" /> Capture selfie
            </Button>
          </DialogFooter>
          <canvas ref={canvasRef} className="hidden" />
        </DialogContent>
      </Dialog>
    </>
  );
}