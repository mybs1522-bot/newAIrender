"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Gift,
  HelpCircle,
  Loader2,
  LogOut,
  RefreshCw,
  Shield,
  Sparkles,
  Star,
  TrendingDown,
  User,
  X,
  Zap,
} from "lucide-react";

interface SubInfo {
  subscribed: boolean;
  status: "active" | "trialing" | null;
  trialEnd: number | null;
  currentPeriodEnd: number | null;
  cancelAtPeriodEnd: boolean;
  plan: string | null;
  amount: number | null;
  interval: string | null;
}

interface UsageInfo {
  count: number;
  limit: number;
}

const CANCEL_REASONS = [
  { id: "expensive", label: "It's too expensive", icon: CreditCard },
  { id: "not_using", label: "I'm not using it enough", icon: TrendingDown },
  { id: "missing", label: "Missing features I need", icon: HelpCircle },
  { id: "alternative", label: "Found a better alternative", icon: RefreshCw },
  { id: "temporary", label: "Taking a temporary break", icon: Calendar },
  { id: "other", label: "Other reason", icon: X },
];

const LOSING_ITEMS = [
  { icon: Sparkles, text: "Unlimited AI interior & exterior redesigns" },
  { icon: Star, text: "Access to all 20+ premium design styles" },
  { icon: Zap, text: "Photorealistic DSLR-quality renders" },
  { icon: Shield, text: "Priority generation queue" },
  { icon: Gift, text: "All future feature updates included" },
];

function fmt(ts: number | null) {
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [sub, setSub] = useState<SubInfo | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelOpen, setCancelOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/stripe/subscription").then((r) => r.json()),
      fetch("/api/usage").then((r) => r.json()),
    ]).then(([s, u]) => {
      setSub(s);
      setUsage(u);
      setLoading(false);
    });
  }, []);

  function refreshSub() {
    setLoading(true);
    fetch("/api/stripe/subscription")
      .then((r) => r.json())
      .then((s) => { setSub(s); setLoading(false); });
  }

  const statusLabel =
    sub?.cancelAtPeriodEnd
      ? "Cancels at period end"
      : sub?.status === "trialing"
      ? "Free Trial"
      : sub?.status === "active"
      ? "Active"
      : "No plan";

  const statusColor =
    sub?.cancelAtPeriodEnd
      ? "text-orange-500"
      : sub?.status === "trialing"
      ? "text-amber-500"
      : sub?.status === "active"
      ? "text-green-500"
      : "text-zinc-400";

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
      {/* Profile header */}
      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 dark:bg-zinc-900/50 p-6">
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? ""}
            width={64}
            height={64}
            className="rounded-full ring-2 ring-white/20"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
            <User className="h-8 w-8 text-zinc-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white truncate">
            {session?.user?.name ?? "Account"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
            {session?.user?.email}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white gap-2"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>

      {/* Subscription card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 dark:bg-zinc-900/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-900 dark:text-white">Subscription</h2>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
        </div>

        <div className="p-6 space-y-5">
          {!sub?.subscribed ? (
            <p className="text-sm text-zinc-400">No active subscription.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Plan</p>
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    {sub.plan ?? "—"}
                    {sub.amount && (
                      <span className="ml-1 text-sm font-normal text-zinc-400">
                        ${(sub.amount / 100).toFixed(0)}/{sub.interval === "year" ? "yr" : "mo"}
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Status</p>
                  <p className={`font-semibold ${statusColor}`}>{statusLabel}</p>
                </div>

                {sub.status === "trialing" && sub.trialEnd && (
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Trial ends</p>
                    <p className="font-medium text-zinc-900 dark:text-white">{fmt(sub.trialEnd)}</p>
                  </div>
                )}

                {sub.currentPeriodEnd && (
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                      {sub.cancelAtPeriodEnd ? "Access until" : "Next billing"}
                    </p>
                    <p className="font-medium text-zinc-900 dark:text-white">{fmt(sub.currentPeriodEnd)}</p>
                  </div>
                )}
              </div>

              {/* Usage */}
              {usage && (
                <div>
                  <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                    <span>Renders used</span>
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {sub.status === "active" && !sub.cancelAtPeriodEnd
                        ? `${usage.count} (unlimited)`
                        : `${usage.count} / ${usage.limit}`}
                    </span>
                  </div>
                  {sub.status === "trialing" && (
                    <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all"
                        style={{ width: `${Math.min((usage.count / usage.limit) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

              {sub.cancelAtPeriodEnd && (
                <div className="rounded-xl border border-orange-200 dark:border-orange-900/40 bg-orange-50 dark:bg-orange-950/20 p-4 text-sm text-orange-700 dark:text-orange-400">
                  <AlertTriangle className="h-4 w-4 inline mr-1.5 -mt-0.5" />
                  Your subscription is scheduled to cancel on{" "}
                  <strong>{fmt(sub.currentPeriodEnd)}</strong>. You still have full access until then.
                </div>
              )}
            </>
          )}
        </div>

        {sub?.subscribed && !sub.cancelAtPeriodEnd && (
          <div className="px-6 pb-6">
            <button
              onClick={() => setCancelOpen(true)}
              className="text-xs text-zinc-400 hover:text-red-500 dark:hover:text-red-400 underline underline-offset-2 transition-colors"
            >
              Cancel subscription
            </button>
          </div>
        )}
      </div>

      {/* Cancel questionnaire dialog */}
      <CancelDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onCancelled={() => { setCancelOpen(false); refreshSub(); }}
      />
    </div>
  );
}

/* ─── Cancellation Questionnaire ───────────────────────────────────────── */

function CancelDialog({
  open,
  onClose,
  onCancelled,
}: {
  open: boolean;
  onClose: () => void;
  onCancelled: () => void;
}) {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  function reset() {
    setStep(1);
    setReason(null);
    setConfirmText("");
    setLoading(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleConfirmCancel() {
    if (confirmText.trim().toUpperCase() !== "CANCEL") return;
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/cancel", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to cancel");
        return;
      }
      toast.success("Subscription will cancel at the end of the billing period.");
      reset();
      onCancelled();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-md gap-0 p-0 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">

        {/* Step indicator */}
        <div className="flex gap-1 px-6 pt-5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all ${
                s <= step ? "bg-red-500" : "bg-zinc-200 dark:bg-zinc-700"
              }`}
            />
          ))}
        </div>

        {/* ── Step 1: Reason ── */}
        {step === 1 && (
          <>
            <div className="px-6 pt-4 pb-3">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Why are you leaving?</DialogTitle>
                <DialogDescription className="text-sm text-zinc-500">
                  Help us improve by telling us your reason.
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="px-6 pb-4 space-y-2">
              {CANCEL_REASONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setReason(id)}
                  className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm text-left transition-all ${
                    reason === id
                      ? "border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800 font-medium"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <Icon className="h-4 w-4 text-zinc-400 shrink-0" />
                  {label}
                  {reason === id && <CheckCircle2 className="h-4 w-4 ml-auto text-zinc-900 dark:text-white" />}
                </button>
              ))}
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={handleClose}>
                Keep my plan
              </Button>
              <Button
                className="flex-1 gap-1 bg-zinc-900 dark:bg-white dark:text-zinc-900"
                disabled={!reason}
                onClick={() => setStep(2)}
              >
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {/* ── Step 2: What you'll lose ── */}
        {step === 2 && (
          <>
            <div className="px-6 pt-4 pb-3">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-red-600 dark:text-red-400">
                  You&apos;ll lose access to everything
                </DialogTitle>
                <DialogDescription className="text-sm text-zinc-500">
                  When your subscription ends, all of these go away permanently.
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="px-6 pb-4 space-y-3">
              {LOSING_ITEMS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-red-500" />
                  </div>
                  <span className="text-zinc-700 dark:text-zinc-300">{text}</span>
                </div>
              ))}
              <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 p-3 text-xs text-red-600 dark:text-red-400 mt-2">
                <AlertTriangle className="h-3.5 w-3.5 inline mr-1 -mt-0.5" />
                Your design history and preferences will not be recoverable.
              </div>
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-zinc-200 dark:border-zinc-700"
                onClick={() => setStep(1)}
              >
                ← Back
              </Button>
              <Button
                className="flex-1 bg-zinc-900 dark:bg-white dark:text-zinc-900 gap-1"
                onClick={() => setStep(3)}
              >
                I understand, continue <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {/* ── Step 3: Offer to stay ── */}
        {step === 3 && (
          <>
            <div className="px-6 pt-4 pb-3">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  Before you go — one last thing
                </DialogTitle>
                <DialogDescription className="text-sm text-zinc-500">
                  Many users come back within a week. Are you sure you won&apos;t need this?
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="px-6 pb-4 space-y-3">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-5 text-center space-y-2">
                <Sparkles className="h-8 w-8 mx-auto text-amber-500" />
                <p className="font-semibold text-zinc-900 dark:text-white">Stay and keep creating</p>
                <p className="text-xs text-zinc-500">
                  Thousands of designers use this every month to transform spaces. Your next project might be your best one.
                </p>
              </div>
              <Button
                className="w-full gap-2 bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:bg-zinc-800"
                onClick={handleClose}
              >
                <Sparkles className="h-4 w-4" />
                Keep my subscription
              </Button>
              <button
                onClick={() => setStep(4)}
                className="w-full text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 py-1 transition-colors"
              >
                No thanks, I still want to cancel
              </button>
            </div>
          </>
        )}

        {/* ── Step 4: Type CANCEL to confirm ── */}
        {step === 4 && (
          <>
            <div className="px-6 pt-4 pb-3">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-red-600 dark:text-red-400">
                  Final confirmation
                </DialogTitle>
                <DialogDescription className="text-sm text-zinc-500">
                  Type <strong className="text-zinc-900 dark:text-white font-mono">CANCEL</strong> below to confirm cancellation. This cannot be undone.
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="px-6 pb-2 space-y-3">
              <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 p-3 text-xs text-red-600 dark:text-red-400">
                <AlertTriangle className="h-3.5 w-3.5 inline mr-1 -mt-0.5" />
                Your subscription will remain active until the end of the billing period, then cancel automatically.
              </div>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type CANCEL here"
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-4 py-3 text-sm font-mono placeholder:text-zinc-300 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-zinc-200 dark:border-zinc-700"
                onClick={() => setStep(3)}
              >
                ← Back
              </Button>
              <Button
                className="flex-1 gap-2 bg-red-600 hover:bg-red-700 text-white disabled:opacity-40"
                disabled={confirmText.trim().toUpperCase() !== "CANCEL" || loading}
                onClick={handleConfirmCancel}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Cancelling…" : "Confirm cancel"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
