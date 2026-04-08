"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  "Unlimited AI renders",
  "All 20+ design styles",
  "Photorealistic DSLR-quality output",
  "Instant auto-download",
  "Interior & exterior redesign",
  "Priority generation queue",
];

interface Props {
  open: boolean;
  onClose: () => void;
  hadTrial?: boolean;
}

export function PricingModal({ open, onClose, hadTrial = false }: Props) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<"monthly" | "yearly" | null>(null);

  async function handleSubscribe(plan: "monthly" | "yearly") {
    if (!session?.user) {
      signIn("google");
      return;
    }
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        {/* Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-5">
          <DialogHeader className="space-y-0.5">
            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white">
              Unlock AI Design Generation
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
              {hadTrial
                ? "Choose a plan to continue generating designs."
                : "3-day free trial · 3 renders included · No charge until the trial ends — cancel anytime."}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Plan cards */}
        <div className="grid sm:grid-cols-2 gap-3 p-4">
          {/* Monthly */}
          <div className="relative flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Monthly
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  $20
                </span>
                <span className="text-sm text-zinc-400 dark:text-zinc-500">/ month</span>
              </div>
              {!hadTrial && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
                  <Zap className="h-3 w-3 fill-current" />
                  3-day free trial · 3 renders
                </div>
              )}
            </div>

            <ul className="flex-1 space-y-2.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <Check className="h-4 w-4 shrink-0 text-green-500" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              variant="outline"
              className="w-full gap-2 rounded-xl border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800"
              disabled={loading !== null}
              onClick={() => handleSubscribe("monthly")}
            >
              <Sparkles className="h-4 w-4" />
              {loading === "monthly" ? "Redirecting…" : hadTrial ? "Subscribe now" : "Start free trial"}
            </Button>
          </div>

          {/* Yearly */}
          <div className="relative flex flex-col rounded-2xl border border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 p-5 gap-4">
            {/* Save badge */}
            <div className="absolute -top-px right-4 rounded-b-xl bg-zinc-900 dark:bg-white px-3 py-1 text-xs font-bold text-white dark:text-zinc-900">
              Save 17%
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Yearly
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  $200
                </span>
                <span className="text-sm text-zinc-400 dark:text-zinc-500">/ year</span>
              </div>
              <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">≈ $16.67 / mo</p>
              {!hadTrial && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
                  <Zap className="h-3 w-3 fill-current" />
                  3-day free trial · 3 renders
                </div>
              )}
            </div>

            <ul className="flex-1 space-y-2.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <Check className="h-4 w-4 shrink-0 text-green-500" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              className={cn(
                "w-full gap-2 rounded-xl",
                "bg-zinc-900 hover:bg-zinc-800 text-white",
                "dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900",
              )}
              disabled={loading !== null}
              onClick={() => handleSubscribe("yearly")}
            >
              <Sparkles className="h-4 w-4" />
              {loading === "yearly" ? "Redirecting…" : hadTrial ? "Subscribe now" : "Start free trial"}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-3 text-center text-xs text-zinc-400 dark:text-zinc-500">
          {hadTrial
            ? "Secured by Stripe · No trial — billed immediately · Cancel anytime"
            : "Secured by Stripe · Cancel anytime · No hidden fees"}
        </div>
      </DialogContent>
    </Dialog>
  );
}
