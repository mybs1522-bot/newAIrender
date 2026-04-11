"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";

const DIGITS = 6;

/* ── Individual box ──────────────────────────────────────────────────────── */
function OTPBox({
  index,
  state,
  onComplete,
}: {
  index: number;
  state: "idle" | "error" | "success";
  onComplete: () => void;
}) {
  const ctrl = useAnimationControls();

  useEffect(() => {
    ctrl.start({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 700,
        damping: 20,
        delay: index * 0.04,
      },
    });
  }, []);

  useEffect(() => {
    if (state === "success") {
      ctrl.start({
        x: -(index * 60),
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: index * 0.05,
        },
      });
    }
    if (state === "idle" || state === "error") {
      ctrl.start({
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    }
  }, [state]);

  const onFocus = () =>
    ctrl.start({
      y: -4,
      transition: { type: "spring", stiffness: 700, damping: 20 },
    });
  const onBlur = () =>
    ctrl.start({
      y: 0,
      transition: { type: "spring", stiffness: 700, damping: 20 },
    });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const val = (e.target as HTMLInputElement).value;
    if (e.key === "Backspace" && !val && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus();
    if (e.key === "ArrowLeft" && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus();
    if (e.key === "ArrowRight" && index < DIGITS - 1)
      document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const onInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    if (/^[0-9]$/.test(input.value)) {
      if (index < DIGITS - 1)
        document.getElementById(`otp-${index + 1}`)?.focus();
    } else {
      input.value = "";
    }
    onComplete();
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .trim()
      .replace(/\D/g, "")
      .slice(0, DIGITS)
      .split("");
    digits.forEach((d, i) => {
      const el = document.getElementById(
        `otp-${index + i}`
      ) as HTMLInputElement | null;
      if (el) el.value = d;
    });
    const next = Math.min(index + digits.length, DIGITS - 1);
    document.getElementById(`otp-${next}`)?.focus();
    setTimeout(onComplete, 0);
  };

  const ringColor =
    state === "error"
      ? "ring-red-400"
      : state === "success"
        ? "ring-emerald-500"
        : "ring-gray-200 focus-within:ring-violet-400";

  return (
    <motion.div
      className={`h-14 w-11 overflow-hidden rounded-xl ring-2 transition-all duration-200 ${ringColor}`}
      initial={{ opacity: 0, y: 10 }}
      animate={ctrl}
    >
      <input
        id={`otp-${index}`}
        type="text"
        inputMode="numeric"
        maxLength={1}
        onInput={onInput}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={state === "success"}
        className="h-full w-full bg-white text-center text-2xl font-semibold text-gray-900 caret-violet-600 outline-none disabled:cursor-not-allowed disabled:opacity-60"
      />
    </motion.div>
  );
}

/* ── Public component ────────────────────────────────────────────────────── */
interface OTPInputProps {
  email: string;
  loading: boolean;
  error: string;
  success: boolean;
  onVerify: (code: string) => void;
  onResend: () => void;
}

export function OTPInput({
  email,
  loading,
  error,
  success,
  onVerify,
  onResend,
}: OTPInputProps) {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const shakeCtrl = useAnimationControls();

  /* countdown timer */
  useEffect(() => {
    if (canResend) return;
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(id);
          setCanResend(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [canResend]);

  /* shake on error */
  useEffect(() => {
    if (!error) return;
    shakeCtrl.start({
      x: [0, 6, -6, 6, -6, 0],
      transition: { duration: 0.35 },
    });
    /* clear inputs */
    for (let i = 0; i < DIGITS; i++) {
      const el = document.getElementById(`otp-${i}`) as HTMLInputElement | null;
      if (el) el.value = "";
    }
    document.getElementById("otp-0")?.focus();
  }, [error]);

  const getCode = () => {
    let code = "";
    for (let i = 0; i < DIGITS; i++) {
      const el = document.getElementById(`otp-${i}`) as HTMLInputElement | null;
      code += el?.value ?? "";
    }
    return code;
  };

  const handleComplete = () => {
    const code = getCode();
    if (code.length === DIGITS) onVerify(code);
  };

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
    onResend();
  };

  const state: "idle" | "error" | "success" = success
    ? "success"
    : error
      ? "error"
      : "idle";

  return (
    <div className="space-y-6">
      {/* Sent-to banner */}
      <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-center text-sm text-violet-700">
        Code sent to <span className="font-semibold">{email}</span>
      </div>

      {/* Boxes */}
      <div className="flex flex-col items-center gap-1">
        <motion.div
          animate={shakeCtrl}
          className="flex items-center justify-center gap-2.5"
        >
          {Array.from({ length: DIGITS }).map((_, i) => (
            <OTPBox
              key={i}
              index={i}
              state={state}
              onComplete={handleComplete}
            />
          ))}
        </motion.div>

        {/* Error / success inline */}
        <AnimatePresence mode="wait">
          {state === "error" && (
            <motion.p
              key="err"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-1 flex items-center gap-1.5 text-xs text-red-500"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
              {error}
            </motion.p>
          )}
          {state === "success" && (
            <motion.p
              key="ok"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-600"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Signed in — redirecting…
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Loading bar */}
      {loading && (
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="h-full rounded-full bg-violet-500"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        </div>
      )}

      {/* Resend */}
      <p className="text-center text-xs text-gray-400">
        Didn't get a code?{" "}
        {canResend ? (
          <button
            onClick={handleResend}
            className="font-semibold text-violet-600 hover:underline"
          >
            Resend
          </button>
        ) : (
          <span className="text-gray-400">Resend in {countdown}s</span>
        )}
      </p>
    </div>
  );
}
