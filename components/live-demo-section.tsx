"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
} from "framer-motion";
import Image from "next/image";
import { Sparkles, Upload, RotateCcw, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Images ─────────────────────────────────────────────── */
const BEFORE =
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85";
const AFTER =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=85";

/* ─── Option groups ───────────────────────────────────────── */
const OPTIONS = [
  {
    key: "room",
    label: "Room Type",
    choices: ["Living Room", "Bedroom", "Kitchen", "Office"],
    autoSelect: "Living Room",
  },
  {
    key: "style",
    label: "Design Style",
    choices: ["Modern", "Scandinavian", "Industrial", "Coastal"],
    autoSelect: "Modern",
  },
  {
    key: "lighting",
    label: "Lighting",
    choices: ["Natural", "Warm", "Dramatic", "Cool"],
    autoSelect: "Warm",
  },
  {
    key: "palette",
    label: "Color Palette",
    choices: ["Neutral", "Earthy", "Bold", "Monochrome"],
    autoSelect: "Neutral",
  },
  {
    key: "material",
    label: "Materials",
    choices: ["Wood", "Marble", "Concrete", "Linen"],
    autoSelect: "Wood",
  },
] as const;

type OptionKey = (typeof OPTIONS)[number]["key"];
type Selections = Partial<Record<OptionKey, string>>;

/* ─── Cursor SVG ──────────────────────────────────────────── */
function CursorSVG({ pressing }: { pressing: boolean }) {
  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      animate={{ scale: pressing ? 0.8 : 1 }}
      transition={{ type: "spring", stiffness: 700, damping: 28 }}
      style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }}
    >
      <path
        d="M2.5 2.5L11 21.5L14 14L21.5 11L2.5 2.5Z"
        fill="white"
        stroke="#111827"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

/* ─── Click ripple ────────────────────────────────────────── */
function Ripple() {
  return (
    <motion.span
      className="pointer-events-none absolute inset-0 rounded-lg bg-white/40"
      initial={{ scale: 0.4, opacity: 1 }}
      animate={{ scale: 2.4, opacity: 0 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
    />
  );
}

/* ─── Animated option chip ────────────────────────────────── */
function Chip({
  label,
  selected,
  ripple,
  refProp,
}: {
  label: string;
  selected: boolean;
  ripple: boolean;
  refProp?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <div className="relative">
      {ripple && <Ripple />}
      <motion.button
        ref={refProp}
        layout
        animate={selected ? { scale: [1, 1.18, 0.96, 1] } : { scale: 1 }}
        transition={
          selected
            ? { duration: 0.35, times: [0, 0.35, 0.65, 1], ease: "easeInOut" }
            : { duration: 0.15 }
        }
        className={cn(
          "relative rounded-lg border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition-colors duration-150",
          selected
            ? "border-foreground bg-foreground text-background shadow-sm"
            : "bg-muted/40 text-muted-foreground"
        )}
      >
        {label}
      </motion.button>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────── */
export function LiveDemoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const uploadBtnRef = useRef<HTMLButtonElement>(null);
  const generateBtnRef = useRef<HTMLButtonElement>(null);
  /* one ref per auto-selected chip */
  const chipRefs = useRef<Partial<Record<OptionKey, HTMLButtonElement | null>>>(
    {}
  );

  const cursorX = useMotionValue(-999);
  const cursorY = useMotionValue(-999);

  const [hasImage, setHasImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResult, setIsResult] = useState(false);
  const [selections, setSelections] = useState<Selections>({});
  const [ripples, setRipples] = useState<Partial<Record<string, boolean>>>({});
  const [cursorVisible, setCursorVisible] = useState(false);
  const [pressing, setPressing] = useState(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);
  const loopRef = useRef<() => void>(() => {});

  const clearAll = () => timers.current.forEach(clearTimeout);

  /* Move cursor to a DOM element */
  const moveTo = useCallback(
    async (el: HTMLElement | null, duration = 0.65) => {
      if (!el || !containerRef.current) return;
      const eR = el.getBoundingClientRect();
      const cR = containerRef.current.getBoundingClientRect();
      const tx = eR.left - cR.left + eR.width / 2 - 12;
      const ty = eR.top - cR.top + eR.height / 2 - 3;
      await Promise.all([
        animate(cursorX, tx, {
          duration,
          ease: [0.22, 1, 0.36, 1] /* expo-out — snappy */,
        }),
        animate(cursorY, ty, {
          duration,
          ease: [0.22, 1, 0.36, 1],
        }),
      ]);
    },
    [cursorX, cursorY]
  );

  /* Simulate a click with ripple + press */
  const doClick = useCallback((key: string) => {
    setPressing(true);
    setRipples((r) => ({ ...r, [key]: true }));
    setTimeout(() => {
      setPressing(false);
      setRipples((r) => ({ ...r, [key]: false }));
    }, 380);
  }, []);

  /* ─── Master sequence ─────────────────────────────────── */
  const runSequence = useCallback(() => {
    clearAll();
    setCursorVisible(false);
    setHasImage(false);
    setIsLoading(false);
    setIsResult(false);
    setSelections({});
    setRipples({});
    setPressing(false);
    cursorX.set(-999);
    cursorY.set(-999);

    const t = (ms: number, fn: () => void) => {
      const id = setTimeout(fn, ms);
      timers.current.push(id);
    };

    /* Place cursor near upload area */
    t(300, () => {
      const cR = containerRef.current?.getBoundingClientRect();
      const uR = uploadBtnRef.current?.getBoundingClientRect();
      if (cR && uR) {
        cursorX.set(uR.right - cR.left + 10);
        cursorY.set(uR.top - cR.top - 30);
      }
      setCursorVisible(true);
    });

    /* Move to Upload Photo button */
    t(380, () => moveTo(uploadBtnRef.current, 0.65));

    /* Click upload */
    t(1100, () => doClick("upload"));
    t(1120, () => setHasImage(true));

    /* Sequentially select each option group */
    const selectSequence: Array<{ key: OptionKey; ms: number }> = [
      { key: "room", ms: 1700 },
      { key: "style", ms: 2550 },
      { key: "lighting", ms: 3350 },
      { key: "palette", ms: 4100 },
      { key: "material", ms: 4850 },
    ];

    let moveStart = 1700;
    for (const { key, ms } of selectSequence) {
      const k = key; /* capture */
      const autoVal = OPTIONS.find((o) => o.key === k)!.autoSelect;
      t(moveStart - 50, () => moveTo(chipRefs.current[k] ?? null, 0.55));
      t(ms, () => {
        doClick(k);
        setSelections((s) => ({ ...s, [k]: autoVal }));
      });
      moveStart = ms + 750;
    }

    /* Move to Generate button */
    t(5620, () => moveTo(generateBtnRef.current, 0.8));

    /* Click Generate */
    t(6500, () => {
      doClick("generate");
      setTimeout(() => setIsLoading(true), 200);
    });

    /* Show result */
    t(8000, () => {
      setIsLoading(false);
      setIsResult(true);
      setCursorVisible(false);
    });

    /* Loop */
    t(14000, () => loopRef.current());
  }, [cursorX, cursorY, doClick, moveTo]);

  useEffect(() => {
    loopRef.current = runSequence;
  }, [runSequence]);

  /* Trigger on scroll into view */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          runSequence();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReplay = () => {
    started.current = false;
    runSequence();
    started.current = true;
  };

  return (
    <section className="py-4">
      {/* Heading */}
      <div className="mb-10 text-center">
        <span className="bg-background text-muted-foreground mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
          <Sparkles className="h-3 w-3" />
          Live demo
        </span>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          See the transformation
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Watch the full workflow — upload, configure every detail, and
          generate.
        </p>
      </div>

      {/* ── Demo card ── */}
      <div
        ref={containerRef}
        className="bg-background relative mx-auto max-w-3xl overflow-hidden rounded-2xl border shadow-xl"
      >
        {/* Browser chrome */}
        <div className="bg-muted/40 flex items-center gap-2 border-b px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          <div className="bg-background ml-3 flex-1 rounded-md border px-3 py-0.5 text-center text-xs text-gray-400">
            app.interiordesigner.ai/render
          </div>
          <AnimatePresence>
            {isResult && (
              <motion.button
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                onClick={handleReplay}
                className="text-muted-foreground hover:text-foreground ml-2 flex items-center gap-1 text-xs transition-colors"
              >
                <RotateCcw className="h-3 w-3" /> Replay
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Main content */}
        <div className="flex flex-col sm:flex-row">
          {/* ── Left: image panel ── */}
          <div className="relative h-52 w-full overflow-hidden sm:h-[300px] sm:w-[52%] sm:border-r">
            <AnimatePresence mode="wait">
              {!hasImage ? (
                /* Upload dropzone */
                <motion.div
                  key="dropzone"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  exit={{
                    opacity: 0,
                    scale: 0.97,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="bg-muted/60 rounded-xl p-4">
                    <ImageIcon
                      className="text-muted-foreground h-7 w-7"
                      strokeWidth={1.4}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Drop your room photo</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      JPG · PNG · HEIC — up to 10 MB
                    </p>
                  </div>
                  <div className="relative mt-1">
                    {ripples["upload"] && <Ripple />}
                    <button
                      ref={uploadBtnRef}
                      className="bg-foreground text-background flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Upload Photo
                    </button>
                  </div>
                </motion.div>
              ) : isResult ? (
                /* After image */
                <motion.div
                  key="after"
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={AFTER}
                    alt="AI render"
                    fill
                    className="object-cover"
                    sizes="500px"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm"
                  >
                    <Sparkles className="h-3 w-3 text-yellow-300" />
                    AI Render — Modern · Warm
                  </motion.div>
                </motion.div>
              ) : (
                /* Before image */
                <motion.div
                  key="before"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <Image
                    src={BEFORE}
                    alt="Original room"
                    fill
                    className="object-cover"
                    priority
                    sizes="500px"
                  />
                  <div className="absolute top-2.5 left-2.5 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                    Original room
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right: options panel ── */}
          <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto p-4 sm:max-h-[300px] sm:p-4">
            {OPTIONS.map((group, gi) => {
              const sel = selections[group.key];
              return (
                <motion.div
                  key={group.key}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: hasImage ? 1 : 0, x: hasImage ? 0 : 10 }}
                  transition={{
                    duration: 0.3,
                    delay: hasImage ? gi * 0.06 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <p className="text-muted-foreground mb-1.5 text-[10px] font-semibold tracking-widest uppercase">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.choices.map((choice) => (
                      <Chip
                        key={choice}
                        label={choice}
                        selected={sel === choice}
                        ripple={
                          !!(ripples[group.key] && choice === group.autoSelect)
                        }
                        refProp={
                          choice === group.autoSelect
                            ? (el: HTMLButtonElement | null) => {
                                chipRefs.current[group.key] = el;
                              }
                            : undefined
                        }
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}

            {/* Summary pill */}
            <AnimatePresence>
              {Object.keys(selections).length === OPTIONS.length &&
                !isResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-auto flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5 text-[11px] text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    All options set — ready to generate
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Generate button bar ── */}
        <div className="border-t px-5 py-3">
          <div className="relative flex items-center justify-between gap-4">
            {/* Progress dots */}
            <div className="flex items-center gap-1">
              {OPTIONS.map((o) => (
                <motion.span
                  key={o.key}
                  animate={{
                    scale: selections[o.key] ? 1 : 0.6,
                    opacity: selections[o.key] ? 1 : 0.3,
                    backgroundColor: selections[o.key]
                      ? "var(--foreground)"
                      : "var(--muted-foreground)",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  className="inline-block h-1.5 w-1.5 rounded-full"
                />
              ))}
              <span className="text-muted-foreground ml-2 text-[11px]">
                {Object.keys(selections).length}/{OPTIONS.length} configured
              </span>
            </div>

            {/* Generate button */}
            <div className="relative">
              {ripples["generate"] && <Ripple />}
              <motion.button
                ref={generateBtnRef}
                animate={
                  pressing && ripples["generate"]
                    ? { scale: 0.92 }
                    : { scale: 1 }
                }
                transition={{ type: "spring", stiffness: 600, damping: 30 }}
                className={cn(
                  "relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow transition-colors",
                  isResult
                    ? "bg-green-600 text-white"
                    : "bg-foreground text-background"
                )}
              >
                {isLoading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.75,
                        ease: "linear",
                      }}
                      className="inline-block h-4 w-4 rounded-full border-2 border-current/25 border-t-current"
                    />
                    Generating…
                  </>
                ) : isResult ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Render complete!
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

        {/* ── Floating cursor ── */}
        <AnimatePresence>
          {cursorVisible && (
            <motion.div
              key="cursor"
              className="pointer-events-none absolute z-30"
              style={{ x: cursorX, y: cursorY }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <CursorSVG pressing={pressing} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Social proof */}
      <div className="text-muted-foreground mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs">
        <span>⚡ Average render time: 18 s</span>
        <span>·</span>
        <span>🎨 20+ design styles</span>
        <span>·</span>
        <span>📐 Layout preserved</span>
        <span>·</span>
        <span>🔒 Photos never stored</span>
      </div>
    </section>
  );
}
