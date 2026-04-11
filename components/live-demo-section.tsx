"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles, RotateCcw } from "lucide-react";

const BEFORE =
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=960&q=85";
const AFTER =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=960&q=85";

type Phase = "before" | "moving" | "clicking" | "loading" | "after";

function CursorIcon({ clicking }: { clicking: boolean }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}
    >
      <path
        d="M4 4L13.5 24L16.5 16L24 13.5L4 4Z"
        fill="white"
        stroke="#111"
        strokeWidth="1.8"
        strokeLinejoin="round"
        style={{
          transform: clicking ? "scale(0.88)" : "scale(1)",
          transformOrigin: "4px 4px",
          transition: "transform 0.1s",
        }}
      />
    </svg>
  );
}

function Ripple() {
  return (
    <motion.span
      className="absolute inset-0 rounded-xl bg-white/30"
      initial={{ scale: 0.6, opacity: 0.7 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
  );
}

export function LiveDemoSection() {
  const [phase, setPhase] = useState<Phase>("before");
  const [ripple, setRipple] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);

  const clearTimers = () => timers.current.forEach(clearTimeout);

  const runSequence = () => {
    clearTimers();
    setPhase("before");
    setRipple(false);
    timers.current = [
      setTimeout(() => setPhase("moving"), 900),
      setTimeout(() => {
        setPhase("clicking");
        setRipple(true);
        setTimeout(() => setRipple(false), 600);
      }, 2500),
      setTimeout(() => setPhase("loading"), 2800),
      setTimeout(() => setPhase("after"), 4000),
      setTimeout(() => runSequence(), 9500),
    ];
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          setTimeout(() => runSequence(), 300);
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cursorVisible =
    phase === "moving" || phase === "clicking" || phase === "loading";

  return (
    <section className="py-4">
      {/* Heading */}
      <div className="mb-10 text-center">
        <span className="bg-background text-muted-foreground mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
          <Sparkles className="h-3 w-3" />
          Live preview
        </span>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          See the transformation
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          One click turns a plain room into a designer render.
        </p>
      </div>

      {/* Demo card */}
      <div
        ref={containerRef}
        className="bg-background relative mx-auto max-w-3xl overflow-hidden rounded-2xl border shadow-xl"
      >
        {/* Top bar — fake browser chrome */}
        <div className="bg-muted/50 flex items-center gap-2 border-b px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <div className="bg-background ml-3 flex-1 rounded-md border px-3 py-0.5 text-center text-xs text-gray-400">
            app.interiordesigner.ai/render
          </div>
        </div>

        {/* Image area */}
        <div className="relative h-72 w-full overflow-hidden sm:h-96">
          <AnimatePresence mode="wait">
            {phase !== "after" ? (
              <motion.div
                key="before"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  src={BEFORE}
                  alt="Original room"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                />
                {/* Before label */}
                <div className="absolute top-3 left-3 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  Original room
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="after"
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Image
                  src={AFTER}
                  alt="AI redesigned room"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
                {/* After label */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                >
                  <Sparkles className="h-3 w-3 text-yellow-300" />
                  AI Render
                </motion.div>

                {/* Replay button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  onClick={() => {
                    started.current = false;
                    runSequence();
                    started.current = true;
                  }}
                  className="absolute top-3 right-3 flex items-center gap-1 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  <RotateCcw className="h-3 w-3" /> Replay
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated cursor */}
          <AnimatePresence>
            {cursorVisible && (
              <motion.div
                key="cursor"
                className="pointer-events-none absolute z-20"
                initial={{ left: "72%", top: "22%" }}
                animate={
                  phase === "moving"
                    ? {
                        left: "calc(50% - 40px)",
                        top: "calc(100% + 14px)",
                        transition: {
                          duration: 1.5,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        },
                      }
                    : {
                        left: "calc(50% - 40px)",
                        top: "calc(100% + 14px)",
                        transition: { duration: 0 },
                      }
                }
              >
                <CursorIcon clicking={phase === "clicking"} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom bar — generate button */}
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">
              {phase === "after"
                ? "Modern Minimalist"
                : "Living Room · Modern Minimalist"}
            </p>
            <p className="text-muted-foreground text-xs">
              {phase === "after"
                ? "Photorealistic render complete"
                : "Configure your style, then hit generate"}
            </p>
          </div>

          <div className="relative flex-shrink-0">
            {ripple && <Ripple />}
            <motion.button
              animate={
                phase === "clicking"
                  ? { scale: 0.93 }
                  : phase === "loading" || phase === "after"
                    ? { scale: 1 }
                    : { scale: 1 }
              }
              transition={{ duration: 0.1 }}
              className="relative flex items-center gap-2 overflow-hidden rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              {phase === "loading" ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-gray-900/30 dark:border-t-gray-900" />
                  Generating…
                </>
              ) : phase === "after" ? (
                <>
                  <Sparkles className="h-4 w-4" />
                  Render complete
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Design
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Social proof row */}
      <div className="text-muted-foreground mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs">
        <span>⚡ Average render time: 18 seconds</span>
        <span>·</span>
        <span>🎨 20+ design styles</span>
        <span>·</span>
        <span>📐 Original layout preserved</span>
      </div>
    </section>
  );
}
