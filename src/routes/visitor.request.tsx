import { createFileRoute, Link } from "@tanstack/react-router";
// import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { visitorsApi, type VisitorRequestPayload } from "@/services/api/visitors";
import { config } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrandLogo } from "@/components/common/BrandLogo";
import { SelfieCapture } from "@/components/common/SelfieCapture";
import { getErrorMessage } from "@/services/api/client";
import { toast } from "sonner";
import { CheckCircle2, Loader2, ShieldCheck, ArrowLeft, Clock, XCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export const Route = createFileRoute("/visitor/request")({
  component: VisitorRequestPage,
});

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  middleName: z.string().trim().max(50).optional().or(z.literal("")),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  mobile: z
    .string()
    .trim()
    .min(7, "Enter a valid mobile number")
    .max(15)
    .regex(/^[0-9+\-\s]+$/, "Only digits, +, - allowed"),
  companyName: z.string().trim().max(100).optional().or(z.literal("")),
  hostName: z.string().trim().min(1, "Host name is required").max(100),
  flatNumber: z.string().trim().min(1, "Flat / unit number is required").max(20),
  visitingTo: z.string().trim().min(1, "Whom you are visiting is required").max(100),
  visitorType: z.string().min(1, "Select visitor type"),
  visitDate: z.string().min(1, "Select a visit date"),
  purpose: z.string().trim().min(3, "Briefly describe the purpose").max(300),
  photoUrl: z.string().min(1, "Please capture or upload a selfie"),
});

type FormValues = z.infer<typeof schema>;

const VISITOR_TYPES = ["Guest", "Delivery", "Service", "Contractor", "Interview", "Other"];

function VisitorRequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [visitRequestId, setVisitRequestId] = useState<number | null>(null);
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { visitDate: today, visitorType: "Guest", photoUrl: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload: VisitorRequestPayload = {
        firstName: values.firstName,
        middleName: values.middleName || "",
        lastName: values.lastName,
        mobile: values.mobile,
        companyName: values.companyName || "",
        hostId: config.defaultHostId,
        branchId: config.defaultBranchId,
        purpose: values.purpose,
        hostName: values.hostName,
        flatNumber: values.flatNumber,
        visitingTo: values.visitingTo,
        visitorType: values.visitorType,
        visitDate: new Date(values.visitDate).toISOString(),
        photoUrl: values.photoUrl,
      };
      return visitorsApi.submitRequest(payload);
    },
    onSuccess: (res) => {
      toast.success("Visit request submitted");
      setVisitRequestId(res.visitRequestId);
      setSubmitted(true);
      reset({ visitDate: today, visitorType: "Guest", photoUrl: "" });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (submitted && visitRequestId) {
    return (
      <PublicShell>
        <VisitStatusCard
          visitRequestId={visitRequestId}
          onSubmitAnother={() => {
            setSubmitted(false);
            setVisitRequestId(null);
          }}
        />
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> Public visitor request
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Submit a visit request
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill in your details below. Your host will review and approve your visit.
            </p>
          </div>
        </div>

        <Card className="border-border/60 shadow-[var(--shadow-card)]">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-8">
              <Section title="Visitor details">
                <Field label="First name" error={errors.firstName?.message} required>
                  <Input placeholder="John" {...register("firstName")} />
                </Field>
                <Field label="Middle name" error={errors.middleName?.message}>
                  <Input placeholder="Optional" {...register("middleName")} />
                </Field>
                <Field label="Last name" error={errors.lastName?.message} required>
                  <Input placeholder="Doe" {...register("lastName")} />
                </Field>
                <Field label="Mobile number" error={errors.mobile?.message} required>
                  <Input placeholder="+91 90000 00000" {...register("mobile")} />
                </Field>
                <Field label="Company name" error={errors.companyName?.message} className="sm:col-span-2">
                  <Input placeholder="Optional" {...register("companyName")} />
                </Field>
              </Section>

              <Section title="Visit details">
                <Field label="Host name" error={errors.hostName?.message} required>
                  <Input placeholder="Resident / Owner name" {...register("hostName")} />
                </Field>
                <Field label="Flat / Unit number" error={errors.flatNumber?.message} required>
                  <Input placeholder="e.g. A-1203" {...register("flatNumber")} />
                </Field>
                <Field label="Whom are you visiting?" error={errors.visitingTo?.message} required>
                  <Input placeholder="Full name" {...register("visitingTo")} />
                </Field>
                <Field label="Visitor type" error={errors.visitorType?.message} required>
                  <Select
                    value={watch("visitorType")}
                    onValueChange={(v) => setValue("visitorType", v, { shouldValidate: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {VISITOR_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Visit date" error={errors.visitDate?.message} required>
                  <Input type="date" min={today} {...register("visitDate")} />
                </Field>
                <Field label="Purpose of visit" error={errors.purpose?.message} required className="sm:col-span-2">
                  <Textarea
                    rows={3}
                    placeholder="Briefly describe the purpose of your visit"
                    {...register("purpose")}
                  />
                </Field>
                <Field label="Selfie / photo" error={errors.photoUrl?.message} required className="sm:col-span-2">
                  <SelfieCapture
                    value={watch("photoUrl")}
                    onChange={(value) => setValue("photoUrl", value, { shouldValidate: true, shouldDirty: true })}
                    disabled={mutation.isPending}
                  />
                </Field>
              </Section>

              <div className="flex flex-col-reverse items-stretch justify-end gap-2 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
                <Button type="button" variant="outline" onClick={() => reset({ visitDate: today, visitorType: "Guest", photoUrl: "" })}>
                  Reset
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={mutation.isPending}
                  className="bg-gradient-to-r from-primary to-[var(--primary-glow)] shadow-[var(--shadow-glow)]"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…
                    </>
                  ) : (
                    "Submit request"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  );
}

// ─── Visit Status Card ───────────────────────────────────────────────────────

// function VisitStatusCard({
//   visitRequestId,
//   onSubmitAnother,
// }: {
//   visitRequestId: number;
//   onSubmitAnother: () => void;
// }) {
//   const { data, isLoading } = useQuery({
//     queryKey: ["visit-status", visitRequestId],
//     queryFn: () => visitorsApi.getStatus(visitRequestId),
//     // ✅ Fixed refetchInterval for TanStack Query v5
//     refetchInterval: (query) => {
//       const status = query.state.data?.status;
//       console.log("Polling status:", status, "| qrToken:", query.state.data?.qrToken);
//       return status === "Approved" ? false : 8000;
//     },
//   });

//   return (
//     <Card className="mx-auto max-w-xl border-border/60 shadow-[var(--shadow-elevated)]">
//       <CardContent className="flex flex-col items-center px-6 py-12 text-center">

//         {isLoading ? (
//           <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />

//         ) : data?.status === "Approved" && data?.qrToken ? (
//           <>
//             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
//               <CheckCircle2 className="h-8 w-8" />
//             </div>
//             <h2 className="mt-5 text-2xl font-semibold text-foreground">Request Approved!</h2>
//             <p className="mt-2 text-sm text-muted-foreground">
//               Show this QR code at the gate on your visit date.
//             </p>
//             <div className="mt-6 rounded-xl border border-border/60 bg-white p-4 shadow-sm">
//               <QRCodeSVG value={data.qrToken} size={200} />
//             </div>
//             <p className="mt-3 text-xs text-muted-foreground">
//               {new Date(data.visitDate).toLocaleDateString()} · {data.hostName} · {data.flatNumber}
//             </p>
//           </>

//         ) : data?.status === "Rejected" ? (
//           <>
//             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 text-destructive">
//               <XCircle className="h-8 w-8" />
//             </div>
//             <h2 className="mt-5 text-2xl font-semibold text-foreground">Request Rejected</h2>
//             <p className="mt-2 text-sm text-muted-foreground">
//               Your visit request was not approved by the host.
//             </p>
//           </>

//         ) : (
//           <>
//             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/15 text-warning">
//               <Clock className="h-8 w-8" />
//             </div>
//             <h2 className="mt-5 text-2xl font-semibold text-foreground">Awaiting Approval</h2>
//             <p className="mt-2 text-sm text-muted-foreground">
//               Your request is pending. This page checks automatically every 8 seconds.
//             </p>
//             <p className="mt-1 font-mono text-xs text-muted-foreground">
//               Request ID: #{visitRequestId}
//             </p>
//           </>
//         )}

//         <div className="mt-6 flex flex-wrap justify-center gap-2">
//           <Button onClick={onSubmitAnother}>Submit another request</Button>
//           <Button variant="outline" asChild>
//             <Link to="/">Back to home</Link>
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


function VisitStatusCard({
  visitRequestId,
  onSubmitAnother,
}: {
  visitRequestId: number;
  onSubmitAnother: () => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["visit-status", visitRequestId],
    queryFn: () => visitorsApi.getStatus(visitRequestId),
    refetchInterval: (query) =>
      query.state.data?.status === "Approved" ? false : 8000,
  });

  const [locationSharing, setLocationSharing] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ✅ Start sharing location
  const startLocationSharing = () => {
    if (!navigator.geolocation) {
      setLocationError("GPS not supported on this device.");
      return;
    }

    setLocationSharing(true);
    setLocationError(null);

    const sendLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          visitorsApi.updateLocation(
            visitRequestId,
            pos.coords.latitude,
            pos.coords.longitude
          ).catch(console.error);
        },
        () => setLocationError("Location access denied.")
      );
    };

    sendLocation(); // send immediately
    intervalRef.current = setInterval(sendLocation, 10000); // then every 10s
  };

  const stopLocationSharing = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLocationSharing(false);
  };

  // ✅ Stop sharing when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Card className="mx-auto max-w-xl border-border/60 shadow-[var(--shadow-elevated)]">
      <CardContent className="flex flex-col items-center px-6 py-12 text-center">

        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />

        ) : data?.status === "Approved" && data?.qrToken ? (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-foreground">Request Approved!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Show this QR code at the gate on your visit date.
            </p>
            <div className="mt-6 rounded-xl border border-border/60 bg-white p-4 shadow-sm">
              <QRCodeSVG value={data.qrToken} size={200} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {new Date(data.visitDate).toLocaleDateString()} · {data.hostName} · {data.flatNumber}
            </p>

            {/* ✅ Location sharing section */}
            <div className="mt-6 w-full rounded-xl border border-border/60 bg-muted/30 p-4 text-left">
              <p className="text-sm font-medium text-foreground">📍 Location Sharing</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Share your live location with security after check-in.
              </p>
              {locationError && (
                <p className="mt-2 text-xs text-destructive">{locationError}</p>
              )}
              <div className="mt-3 flex gap-2">
                {!locationSharing ? (
                  <Button size="sm" onClick={startLocationSharing}>
                    Start Sharing Location
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={stopLocationSharing}>
                    <span className="mr-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-success" />
                    Sharing Live · Stop
                  </Button>
                )}
              </div>
            </div>
          </>

        ) : data?.status === "Rejected" ? (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <XCircle className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-foreground">Request Rejected</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your visit request was not approved by the host.
            </p>
          </>

        ) : (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/15 text-warning">
              <Clock className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-foreground">Awaiting Approval</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your request is pending. This page checks automatically every 8 seconds.
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Request ID: #{visitRequestId}
            </p>
          </>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button onClick={onSubmitAnother}>Submit another request</Button>
          <Button variant="outline" asChild>
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Shared UI helpers ───────────────────────────────────────────────────────

function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--gradient-subtle)]">
      <header className="border-b border-border/60 bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <BrandLogo size="md" />
          <Button asChild variant="ghost" size="sm">
            <Link to="/login" search={{ redirect: "" }}>Staff sign in</Link>
          </Button>
        </div>
      </header>
      <main className="px-4 py-8 sm:px-6 sm:py-12">{children}</main>
      <footer className="border-t border-border/60 bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} IDSID PVT LTD — IDS Visitor Management
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-sm">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}