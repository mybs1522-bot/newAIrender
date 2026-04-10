"use client";

import { Palette, Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";

function OTPForm() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, [step]);

  const sendOTP = async () => {
    setError("");
    if (!email.includes("@")) { setError("Enter a valid email address."); return; }
    setLoading(true);
    const res = await fetch("/api/auth/otp-send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (!res.ok) { setError("Could not send code. Try again."); return; }
    setStep("otp");
  };

  const verifyOTP = async () => {
    setError("");
    if (code.length < 6) { setError("Enter the 6-digit code from your email."); return; }
    setLoading(true);
    const { signIn } = await import("next-auth/react");
    const result = await signIn("otp", { email, code, redirect: false, callbackUrl: "/render" });
    setLoading(false);
    if (result?.error) { setError("Invalid or expired code. Try again."); return; }
    setSuccess(true);
    window.location.href = result?.url ?? "/render";
  };

  if (success) {
    return (
      <div className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-green-600 dark:text-green-400">
        <CheckCircle2 className="h-4 w-4" />
        Signed in — redirecting…
      </div>
    );
  }

  if (step === "email") {
    return (
      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Email address
          </label>
          <Input
            ref={inputRef}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendOTP()}
            className="rounded-xl h-11 border-white/15 bg-white/5 focus:bg-white/8"
            disabled={loading}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <Button
          onClick={sendOTP}
          disabled={loading}
          className="w-full gap-2 rounded-xl h-11 bg-foreground text-background hover:bg-foreground/90 font-medium"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Send sign-in code
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 px-4 py-3 text-sm text-center">
        Code sent to <span className="font-semibold">{email}</span>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          6-digit code
        </label>
        <Input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          placeholder="000000"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && verifyOTP()}
          className="rounded-xl h-11 border-white/15 bg-white/5 focus:bg-white/8 text-center text-xl tracking-[0.4em] font-mono"
          disabled={loading}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <Button
        onClick={verifyOTP}
        disabled={loading || code.length < 6}
        className="w-full gap-2 rounded-xl h-11 bg-foreground text-background hover:bg-foreground/90 font-medium"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
        Verify &amp; sign in
      </Button>
      <button
        onClick={() => { setStep("email"); setCode(""); setError(""); }}
        className="w-full text-xs text-muted-foreground flex items-center justify-center gap-1 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3 w-3" /> Change email
      </button>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-500/5 via-indigo-500/5 to-pink-500/5 p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(139,92,246,0.2)]">
            <Palette className="h-7 w-7 text-foreground/80" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Interior Designer AI</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to generate photorealistic renders</p>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/15 bg-white/8 backdrop-blur-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)] space-y-5">
          <div className="space-y-1.5 text-center">
            <h2 className="text-lg font-semibold">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Enter your email to receive a sign-in code</p>
          </div>

          <OTPForm />
        </div>

        <p className="text-center text-xs text-muted-foreground/60">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
