"use client";

import { Palette, Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { SmokeyBackground } from "@/components/ui/login-form";

function OTPForm() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const sendOTP = async () => {
    setError("");
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/otp-send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const body = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(body.detail ?? "Could not send code. Try again.");
      return;
    }
    setOtpToken(body.token);
    setStep("otp");
  };

  const verifyOTP = async () => {
    setError("");
    if (code.length < 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    const { signIn } = await import("next-auth/react");
    const result = await signIn("otp", {
      email,
      code,
      token: otpToken,
      redirect: false,
      callbackUrl: "/render",
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid or expired code. Try again.");
      return;
    }
    setSuccess(true);
    window.location.href = result?.url ?? "/render";
  };

  /* ── Success state ── */
  if (success) {
    return (
      <div className="flex items-center justify-center gap-2 py-4 text-sm font-medium text-emerald-600">
        <CheckCircle2 className="h-4 w-4" />
        Signed in — redirecting…
      </div>
    );
  }

  /* ── Email step ── */
  if (step === "email") {
    return (
      <div className="space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="email"
            id="email"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendOTP()}
            disabled={loading}
            className="peer block w-full rounded-xl border border-gray-200 bg-white/70 px-4 pt-5 pb-2.5 text-sm text-gray-900 shadow-sm backdrop-blur-sm transition focus:border-violet-400 focus:ring-1 focus:ring-violet-400 focus:outline-none disabled:opacity-60"
          />
          <label
            htmlFor="email"
            className="absolute top-4 left-4 z-10 origin-[0] -translate-y-2 scale-75 text-xs font-medium text-gray-500 transition-all select-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-violet-600"
          >
            Email address
          </label>
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-xs text-red-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
            {error}
          </p>
        )}

        <button
          onClick={sendOTP}
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all duration-200 hover:bg-violet-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:outline-none disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          {loading ? "Sending…" : "Send sign-in code"}
          {!loading && (
            <ArrowLeft className="h-4 w-4 rotate-180 opacity-60 transition-transform group-hover:translate-x-0.5" />
          )}
        </button>
      </div>
    );
  }

  /* ── OTP step ── */
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-center text-sm text-violet-700">
        Code sent to <span className="font-semibold">{email}</span>
      </div>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id="otp"
          inputMode="numeric"
          placeholder=" "
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && verifyOTP()}
          disabled={loading}
          className="peer block w-full rounded-xl border border-gray-200 bg-white/70 px-4 pt-5 pb-2.5 text-center font-mono text-2xl tracking-[0.5em] text-gray-900 shadow-sm backdrop-blur-sm transition focus:border-violet-400 focus:ring-1 focus:ring-violet-400 focus:outline-none disabled:opacity-60"
        />
        <label
          htmlFor="otp"
          className="absolute top-4 left-4 z-10 origin-[0] -translate-y-2 scale-75 text-xs font-medium text-gray-500 transition-all select-none peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-violet-600"
        >
          6-digit code
        </label>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
          {error}
        </p>
      )}

      <button
        onClick={verifyOTP}
        disabled={loading || code.length < 6}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition-all duration-200 hover:bg-violet-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:outline-none disabled:opacity-40"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        {loading ? "Verifying…" : "Verify & sign in"}
      </button>

      <button
        onClick={() => {
          setStep("email");
          setCode("");
          setOtpToken("");
          setError("");
        }}
        className="flex w-full items-center justify-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-700"
      >
        <ArrowLeft className="h-3 w-3" /> Use a different email
      </button>
    </div>
  );
}

export default function SignInPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gray-50">
      {/* WebGL smokey background — soft violet on light white */}
      <SmokeyBackground color="#7C3AED" className="opacity-[0.07]" />

      {/* Subtle radial gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(167,139,250,0.15)_0%,transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.1)_0%,transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo + title */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-100 bg-white shadow-lg shadow-violet-100">
              <Palette className="h-7 w-7 text-violet-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Interior Designer AI
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Sign in to generate photorealistic renders
              </p>
            </div>
          </div>

          {/* Card */}
          <div className="space-y-6 rounded-2xl border border-gray-100 bg-white/80 p-8 shadow-xl shadow-gray-100 backdrop-blur-xl">
            <div className="space-y-1 text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Welcome back
              </h2>
              <p className="text-sm text-gray-500">
                Enter your email to receive a one-time sign-in code
              </p>
            </div>

            <OTPForm />
          </div>

          <p className="text-center text-xs text-gray-400">
            By continuing, you agree to our{" "}
            <a href="#" className="text-violet-500 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-violet-500 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
