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

const ROOMS = ["Living Room", "Bedroom", "Kitchen", "Office"];
const STYLES = ["Modern", "Scandinavian", "Industrial", "Art Deco"];

type Phase =
  | "idle"
  | "to-upload"
  | "click-upload"
  | "image-in"
  | "to-room"
  | "click-room"
  | "to-style"
  | "click-style"
  | "to-generate"
  | "click-generate"
  | "loading"
  | "result";

function CursorSVG({ pressing }: { pressing: boolean }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.45))" }}
    >
      <path
        d="M3 3L12 23L15 15L23 12L3 3Z"
        fill="white"
        stroke="#111827"
        strokeWidth="1.8"
        strokeLinejoin="round"
        style={{
          transform: pressing ? "scale(0.85)" : "scale(1)",
          transformOrigin: "3px 3px",
          transition: "transform 0.1s ease",
        }}
      />
    </svg>
  );
}

function ClickRipple() {
  return (
    <motion.span
      className="pointer-events-none absolute inset-0 rounded-lg bg-white/40"
      initial={{ scale: 0.5, opacity: 0.8 }}
      animate={{ scale: 2.2, opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    />
  );
}

export function LiveDemoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const uploadBtnRef = useRef<HTMLButtonElement>(null);
  const roomChipRef = useRef<HTMLButtonElement>(null);
  const styleChipRef = useRef<HTMLButtonElement>(null);
  const generateBtnRef = useRef<HTMLButtonElement>(null);

  const cursorX = useMotionValue(-999);
  const cursorY = useMotionValue(-999);

  const [phase, setPhase] = useState<Phase>("idle");
  const [hasImage, setHasImage] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [uploadRipple, setUploadRipple] = useState(false);
  const [roomRipple, setRoomRipple] = useState(false);
  const [styleRipple, setStyleRipple] = useState(false);
  const [genRipple, setGenRipple] = useState(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);
  const sequenceRef = useRef<() => void>(() => {});

  const clearTimers = () => timers.current.forEach(clearTimeout);

  const moveTo = useCallback(
    async (ref: React.RefObject<HTMLElement | null>, duration = 1.1) => {
      const el = ref.current;
      const container = containerRef.current;
      if (!el || !container) return;
      const eRect = el.getBoundingClientRect();
      const cRect = container.getBoundingClientRect();
      const tx = eRect.left - cRect.left + eRect.width / 2 - 13;
      const ty = eRect.top - cRect.top + eRect.height / 2 - 4;
      await Promise.all([
        animate(cursorX, tx, { duration, ease: [0.25, 0.46, 0.45, 0.94] }),
        animate(cursorY, ty, { duration, ease: [0.25, 0.46, 0.45, 0.94] }),
      ]);
    },
    [cursorX, cursorY]
  );

  const runSequence = useCallback(() => {
    clearTimers();
    setPhase("idle");
    setHasImage(false);
    setSelectedRoom(null);
    setSelectedStyle(null);
    setUploadRipple(false);
    setRoomRipple(false);
    setStyleRipple(false);
    setGenRipple(false);

    /* Initialise cursor off-screen then place it top-right of the image */
    cursorX.set(-999);
    cursorY.set(-999);

    const t = (ms: number, fn: () => void) => {
      const id = setTimeout(fn, ms);
      timers.current.push(id);
      return id;
    };

    /* ── TIMELINE ─────────────────────────────────────────────── */
    t(400, () => {
      /* snap cursor to top-right of image area */
      const container = containerRef.current;
      const upload = uploadBtnRef.current;
      if (container && upload) {
        const cRect = container.getBoundingClientRect();
        const uRect = upload.getBoundingClientRect();
        cursorX.set(uRect.right - cRect.left - 20);
        cursorY.set(uRect.top - cRect.top - 40);
      }
      setPhase("to-upload");
    });

    t(500, async () => {
      await moveTo(uploadBtnRef as React.RefObject<HTMLElement>, 1.1);
    });

    t(1700, () => {
      setPhase("click-upload");
      setUploadRipple(true);
      setTimeout(() => setUploadRipple(false), 500);
    });

    t(2100, () => {
      setHasImage(true);
      setPhase("image-in");
    });

    t(2900, () => {
      setPhase("to-room");
    });

    t(3000, async () => {
      await moveTo(roomChipRef as React.RefObject<HTMLElement>, 1.0);
    });

    t(4100, () => {
      setPhase("click-room");
      setRoomRipple(true);
      setSelectedRoom("Living Room");
      setTimeout(() => setRoomRipple(false), 500);
    });

    t(4500, () => {
      setPhase("to-style");
    });

    t(4600, async () => {
      await moveTo(styleChipRef as React.RefObject<HTMLElement>, 1.0);
    });

    t(5700, () => {
      setPhase("click-style");
      setStyleRipple(true);
      setSelectedStyle("Modern");
      setTimeout(() => setStyleRipple(false), 500);
    });

    t(6100, () => {
      setPhase("to-generate");
    });

    t(6200, async () => {
      await moveTo(generateBtnRef as React.RefObject<HTMLElement>, 1.2);
    });

    t(7500, () => {
      setPhase("click-generate");
      setGenRipple(true);
      setTimeout(() => setGenRipple(false), 500);
    });

    t(7900, () => setPhase("loading"));
    t(9400, () => setPhase("result"));

    /* loop */
    t(15000, () => sequenceRef.current());
  }, [cursorX, cursorY, moveTo]);

  useEffect(() => {
    sequenceRef.current = runSequence;
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
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pressing =
    phase === "click-upload" ||
    phase === "click-room" ||
    phase === "click-style" ||
    phase === "click-generate";

  const cursorVisible = phase !== "idle";
  const isResult = phase === "result";
  const isLoading = phase === "loading";

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
          Watch the full workflow — upload, configure, and generate.
        </p>
      </div>

      {/* Demo card */}
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
          {isResult && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                started.current = false;
                runSequence();
                started.current = true;
              }}
              className="text-muted-foreground hover:text-foreground ml-2 flex items-center gap-1 text-xs transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Replay
            </motion.button>
          )}
        </div>

        {/* Main layout */}
        <div className="flex flex-col sm:flex-row">
          {/* ── Left: Image panel ── */}
          <div className="relative h-56 w-full overflow-hidden sm:h-72 sm:w-[55%] sm:border-r">
            <AnimatePresence mode="wait">
              {!hasImage ? (
                /* Upload dropzone */
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                >
                  <div className="bg-muted/60 rounded-xl p-4">
                    <ImageIcon
                      className="text-muted-foreground h-8 w-8"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      Drop your room photo here
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      JPG, PNG — up to 10 MB
                    </p>
                  </div>
                  <div className="relative">
                    {uploadRipple && <ClickRipple />}
                    <button
                      ref={uploadBtnRef}
                      className="bg-foreground text-background flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm"
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
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                >
                  <Image
                    src={AFTER}
                    alt="AI redesigned room"
                    fill
                    className="object-cover"
                    sizes="500px"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
                  >
                    <Sparkles className="h-3 w-3 text-yellow-300" />
                    AI Render — Modern
                  </motion.div>
                </motion.div>
              ) : (
                /* Before image */
                <motion.div
                  key="before"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={BEFORE}
                    alt="Uploaded room"
                    fill
                    className="object-cover"
                    priority
                    sizes="500px"
                  />
                  <div className="absolute top-2.5 left-2.5 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    Original room
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right: Options panel ── */}
          <div className="flex flex-1 flex-col gap-5 p-4 sm:p-5">
            {/* Room type */}
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                Room Type
              </p>
              <div className="flex flex-wrap gap-2">
                {ROOMS.map((room) => (
                  <div key={room} className="relative">
                    {room === "Living Room" && roomRipple && <ClickRipple />}
                    <button
                      ref={room === "Living Room" ? roomChipRef : undefined}
                      className={cn(
                        "relative rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                        selectedRoom === room
                          ? "border-foreground bg-foreground text-background shadow-sm"
                          : "bg-muted/40 text-muted-foreground hover:border-foreground/30"
                      )}
                    >
                      {room}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Design style */}
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                Design Style
              </p>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((style) => (
                  <div key={style} className="relative">
                    {style === "Modern" && styleRipple && <ClickRipple />}
                    <button
                      ref={style === "Modern" ? styleChipRef : undefined}
                      className={cn(
                        "relative rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                        selectedStyle === style
                          ? "border-foreground bg-foreground text-background shadow-sm"
                          : "bg-muted/40 text-muted-foreground hover:border-foreground/30"
                      )}
                    >
                      {style}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Status line */}
            <AnimatePresence>
              {(selectedRoom || selectedStyle) && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-muted-foreground text-xs"
                >
                  {[selectedRoom, selectedStyle].filter(Boolean).join(" · ")}
                  {selectedRoom && selectedStyle ? " ✓ Ready to generate" : ""}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Bottom bar: Generate button ── */}
        <div className="border-t px-5 py-3.5">
          <div className="relative flex justify-center">
            {genRipple && (
              <span className="absolute inset-0 flex items-center justify-center">
                <ClickRipple />
              </span>
            )}
            <motion.button
              ref={generateBtnRef}
              animate={
                phase === "click-generate" ? { scale: 0.94 } : { scale: 1 }
              }
              transition={{ duration: 0.1 }}
              className={cn(
                "relative flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold shadow-sm transition-colors",
                isResult
                  ? "bg-green-600 text-white"
                  : "bg-foreground text-background"
              )}
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                  Generating render…
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

        {/* ── Floating cursor ── */}
        <AnimatePresence>
          {cursorVisible && (
            <motion.div
              key="cursor"
              className="pointer-events-none absolute z-30"
              style={{ x: cursorX, y: cursorY }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CursorSVG pressing={pressing} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Social proof */}
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
