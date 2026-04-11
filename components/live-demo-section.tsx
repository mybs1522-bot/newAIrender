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

const BEFORE =
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85";
const AFTER =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=85";

const OPTIONS = [
  {
    key: "room" as const,
    label: "Room Type",
    choices: ["Living Room", "Bedroom", "Kitchen", "Office"],
    autoSelect: "Living Room",
  },
  {
    key: "style" as const,
    label: "Design Style",
    choices: ["Modern", "Scandinavian", "Industrial", "Coastal"],
    autoSelect: "Modern",
  },
  {
    key: "lighting" as const,
    label: "Lighting",
    choices: ["Natural", "Warm", "Dramatic", "Cool"],
    autoSelect: "Warm",
  },
  {
    key: "palette" as const,
    label: "Color Palette",
    choices: ["Neutral", "Earthy", "Bold", "Monochrome"],
    autoSelect: "Neutral",
  },
  {
    key: "material" as const,
    label: "Materials",
    choices: ["Wood", "Marble", "Concrete", "Linen"],
    autoSelect: "Wood",
  },
];

type OptionKey = "room" | "style" | "lighting" | "palette" | "material";
type Selections = Partial<Record<OptionKey, string>>;
type RippleMap = Partial<Record<string, boolean>>;

/* ── Cursor SVG ───────────────────────────────────────── */
function CursorSVG({ pressing }: { pressing: boolean }) {
  return (
    <motion.svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      animate={{ scale: pressing ? 0.78 : 1 }}
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

/* ── Click ripple ─────────────────────────────────────── */
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

/* ── Option chip ──────────────────────────────────────── */
interface ChipProps {
  label: string;
  selected: boolean;
  ripple: boolean;
  refProp?: (el: HTMLButtonElement | null) => void;
}
function Chip({ label, selected, ripple, refProp }: ChipProps) {
  return (
    <div className="relative">
      {ripple && <Ripple />}
      <motion.button
        ref={refProp}
        layout
        animate={selected ? { scale: [1, 1.18, 0.96, 1] } : { scale: 1 }}
        transition={
          selected
            ? { duration: 0.32, times: [0, 0.35, 0.65, 1] }
            : { duration: 0.15 }
        }
        className={cn(
          "relative rounded-lg border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap transition-colors duration-150 sm:px-2.5 sm:py-1 sm:text-[11px]",
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

/* ── Main component ───────────────────────────────────── */
export function LiveDemoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const uploadBtnRef = useRef<HTMLButtonElement>(null);
  const generateBtnRef = useRef<HTMLButtonElement>(null);
  const chipRefs = useRef<Partial<Record<OptionKey, HTMLButtonElement | null>>>(
    {}
  );

  const cursorX = useMotionValue(-999);
  const cursorY = useMotionValue(-999);

  const [hasImage, setHasImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResult, setIsResult] = useState(false);
  const [selections, setSelections] = useState<Selections>({});
  const [ripples, setRipples] = useState<RippleMap>({});
  const [cursorVisible, setCursorVisible] = useState(false);
  const [pressing, setPressing] = useState(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);
  const loopRef = useRef<() => void>(() => {});

  const clearAll = () => timers.current.forEach(clearTimeout);

  const moveTo = useCallback(
    async (el: HTMLElement | null, duration = 0.6) => {
      if (!el || !containerRef.current) return;
      const eR = el.getBoundingClientRect();
      const cR = containerRef.current.getBoundingClientRect();
      const tx = eR.left - cR.left + eR.width / 2 - 11;
      const ty = eR.top - cR.top + eR.height / 2 - 3;
      await Promise.all([
        animate(cursorX, tx, { duration, ease: [0.22, 1, 0.36, 1] }),
        animate(cursorY, ty, { duration, ease: [0.22, 1, 0.36, 1] }),
      ]);
    },
    [cursorX, cursorY]
  );

  const doClick = useCallback((key: string) => {
    setPressing(true);
    setRipples((r) => ({ ...r, [key]: true }));
    setTimeout(() => {
      setPressing(false);
      setRipples((r) => ({ ...r, [key]: false }));
    }, 380);
  }, []);

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

    /* Place cursor, then move to Upload button */
    t(300, () => {
      const cR = containerRef.current?.getBoundingClientRect();
      const uR = uploadBtnRef.current?.getBoundingClientRect();
      if (cR && uR) {
        cursorX.set(uR.right - cR.left + 8);
        cursorY.set(uR.top - cR.top - 26);
      }
      setCursorVisible(true);
    });
    t(380, () => moveTo(uploadBtnRef.current, 0.6));

    /* Click upload → image in */
    t(1050, () => doClick("upload"));
    t(1070, () => setHasImage(true));

    /* Select each option group sequentially */
    const seq: Array<{ key: OptionKey; clickAt: number }> = [
      { key: "room", clickAt: 1650 },
      { key: "style", clickAt: 2380 },
      { key: "lighting", clickAt: 3080 },
      { key: "palette", clickAt: 3750 },
      { key: "material", clickAt: 4420 },
    ];

    for (const { key, clickAt } of seq) {
      const k = key;
      const val = OPTIONS.find((o) => o.key === k)!.autoSelect;
      t(clickAt - 580, () => moveTo(chipRefs.current[k] ?? null, 0.5));
      t(clickAt, () => {
        doClick(k);
        setSelections((s) => ({ ...s, [k]: val }));
      });
    }

    /* Move to Generate, click */
    t(5050, () => moveTo(generateBtnRef.current, 0.75));
    t(5900, () => {
      doClick("generate");
      setTimeout(() => setIsLoading(true), 180);
    });

    /* Result */
    t(7400, () => {
      setIsLoading(false);
      setIsResult(true);
      setCursorVisible(false);
    });

    /* Loop */
    t(13500, () => loopRef.current());
  }, [cursorX, cursorY, doClick, moveTo]);

  useEffect(() => {
    loopRef.current = runSequence;
  }, [runSequence]);

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

      {/* Demo card — always landscape */}
      <div
        ref={containerRef}
        className="bg-background relative mx-auto max-w-3xl overflow-hidden rounded-2xl border shadow-xl"
      >
        {/* Browser chrome */}
        <div className="bg-muted/40 flex items-center gap-1.5 border-b px-3 py-2 sm:gap-2 sm:px-4 sm:py-2.5">
          <span className="h-2 w-2 rounded-full bg-red-400/80 sm:h-2.5 sm:w-2.5" />
          <span className="h-2 w-2 rounded-full bg-yellow-400/80 sm:h-2.5 sm:w-2.5" />
          <span className="h-2 w-2 rounded-full bg-green-400/80 sm:h-2.5 sm:w-2.5" />
          <div className="bg-background ml-2 flex-1 rounded-md border px-2 py-0.5 text-center text-[10px] text-gray-400 sm:ml-3 sm:px-3 sm:text-xs">
            app.interiordesigner.ai/render
          </div>
          <AnimatePresence>
            {isResult && (
              <motion.button
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                onClick={handleReplay}
                className="text-muted-foreground hover:text-foreground ml-1 flex items-center gap-1 text-[10px] transition-colors sm:ml-2 sm:text-xs"
              >
                <RotateCcw className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Replay
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Always row — landscape on all screen sizes */}
        <div className="flex flex-row">
          {/* Left: image panel */}
          <div className="relative h-40 w-[48%] shrink-0 overflow-hidden border-r sm:h-[280px] sm:w-[52%]">
            <AnimatePresence mode="wait">
              {!hasImage ? (
                <motion.div
                  key="dropzone"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3"
                  exit={{
                    opacity: 0,
                    scale: 0.97,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="bg-muted/60 rounded-xl p-2.5 sm:p-4">
                    <ImageIcon
                      className="text-muted-foreground h-5 w-5 sm:h-7 sm:w-7"
                      strokeWidth={1.4}
                    />
                  </div>
                  <p className="text-center text-[10px] font-medium sm:text-sm">
                    Drop your room photo
                  </p>
                  <div className="relative">
                    {ripples["upload"] && <Ripple />}
                    <button
                      ref={uploadBtnRef}
                      className="bg-foreground text-background flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold shadow sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
                    >
                      <Upload className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                      Upload Photo
                    </button>
                  </div>
                </motion.div>
              ) : isResult ? (
                <motion.div
                  key="after"
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={AFTER}
                    alt="AI render"
                    fill
                    className="object-cover"
                    sizes="500px"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="absolute top-2 left-2 flex items-center gap-1 rounded-full border border-white/20 bg-black/55 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm sm:top-2.5 sm:left-2.5 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-[11px]"
                  >
                    <Sparkles className="h-2.5 w-2.5 text-yellow-300" />
                    AI Render
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="before"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.32 }}
                >
                  <Image
                    src={BEFORE}
                    alt="Original room"
                    fill
                    className="object-cover"
                    priority
                    sizes="500px"
                  />
                  <div className="absolute top-2 left-2 rounded-full border border-white/20 bg-black/55 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm sm:top-2.5 sm:left-2.5 sm:px-2.5 sm:py-1 sm:text-[11px]">
                    Original
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: options panel */}
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2.5 sm:max-h-[280px] sm:gap-3 sm:p-4">
            {OPTIONS.map((group, gi) => {
              const sel = selections[group.key];
              return (
                <motion.div
                  key={group.key}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{
                    opacity: hasImage ? 1 : 0,
                    x: hasImage ? 0 : 8,
                  }}
                  transition={{
                    duration: 0.28,
                    delay: hasImage ? gi * 0.055 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <p className="text-muted-foreground mb-1 text-[8px] font-semibold tracking-widest uppercase sm:text-[9px]">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1">
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
                            ? (el) => {
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

            {/* All-set badge */}
            <AnimatePresence>
              {Object.keys(selections).length === OPTIONS.length &&
                !isResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="mt-auto flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-2 py-1 text-[9px] text-green-700 sm:gap-1.5 sm:text-[11px] dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Ready to generate
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>

        {/* Generate bar */}
        <div className="border-t px-3 py-2.5 sm:px-5 sm:py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Progress dots */}
            <div className="flex items-center gap-1">
              {OPTIONS.map((o) => (
                <motion.span
                  key={o.key}
                  animate={{
                    scale: selections[o.key] ? 1 : 0.55,
                    opacity: selections[o.key] ? 1 : 0.3,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  className={cn(
                    "inline-block h-1.5 w-1.5 rounded-full",
                    selections[o.key] ? "bg-foreground" : "bg-muted-foreground"
                  )}
                />
              ))}
              <span className="text-muted-foreground ml-1.5 text-[9px] sm:ml-2 sm:text-[11px]">
                {Object.keys(selections).length}/{OPTIONS.length}
              </span>
            </div>

            {/* Generate button */}
            <div className="relative">
              {ripples["generate"] && <Ripple />}
              <motion.button
                ref={generateBtnRef}
                animate={
                  pressing && ripples["generate"]
                    ? { scale: 0.91 }
                    : { scale: 1 }
                }
                transition={{ type: "spring", stiffness: 600, damping: 30 }}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-semibold shadow transition-colors sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm",
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
                        duration: 0.7,
                        ease: "linear",
                      }}
                      className="inline-block h-3 w-3 rounded-full border-2 border-current/25 border-t-current sm:h-4 sm:w-4"
                    />
                    <span className="hidden sm:inline">Generating…</span>
                    <span className="sm:hidden">Generating</span>
                  </>
                ) : isResult ? (
                  <>
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Render complete!</span>
                    <span className="sm:hidden">Done!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                    Generate
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Floating cursor */}
        <AnimatePresence>
          {cursorVisible && (
            <motion.div
              key="cursor"
              className="pointer-events-none absolute z-30"
              style={{ x: cursorX, y: cursorY }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.16 }}
            >
              <CursorSVG pressing={pressing} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Social proof */}
      <div className="text-muted-foreground mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
        <span>⚡ Avg render: 18 s</span>
        <span>·</span>
        <span>🎨 20+ styles</span>
        <span>·</span>
        <span>📐 Layout preserved</span>
        <span>·</span>
        <span>🔒 Photos never stored</span>
      </div>
    </section>
  );
}
