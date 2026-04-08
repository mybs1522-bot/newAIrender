"use client";

import { signIn } from "next-auth/react";
import { Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-500/5 via-indigo-500/5 to-pink-500/5 p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(139,92,246,0.2)]">
            <Palette className="h-7 w-7 text-foreground/80" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Interior Designer AI</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to generate photorealistic renders</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-[1.75rem] border border-white/15 bg-white/8 backdrop-blur-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)] space-y-5">
          <div className="space-y-1.5 text-center">
            <h2 className="text-lg font-semibold">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Continue with your Google account</p>
          </div>

          <Button
            onClick={() => signIn("google", { callbackUrl: "/render" })}
            className="w-full gap-3 rounded-xl h-11 bg-foreground text-background hover:bg-foreground/90 font-medium"
          >
            {/* Google G icon */}
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-foreground/10" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-foreground/10" />
          </div>

          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/render" })}
            className="w-full gap-2 rounded-xl h-11 border-white/15 bg-white/5 hover:bg-white/10"
          >
            <Sparkles className="h-4 w-4 text-violet-400" />
            Open Studio as Guest
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground/60">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
