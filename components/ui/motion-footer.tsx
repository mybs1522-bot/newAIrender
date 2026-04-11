"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  --pill-bg-1: color-mix(in oklch, var(--foreground) 3%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--foreground) 1%, transparent);
  --pill-shadow: color-mix(in oklch, var(--background) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--foreground) 10%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--background) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--foreground) 8%, transparent);
  --pill-bg-1-hover: color-mix(in oklch, var(--foreground) 8%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--foreground) 2%, transparent);
  --pill-border-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--background) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px color-mix(in oklch, var(--destructive) 50%, transparent)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px color-mix(in oklch, var(--destructive) 80%, transparent)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

.footer-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    color-mix(in oklch, var(--primary) 15%, transparent) 0%, 
    color-mix(in oklch, var(--secondary) 15%, transparent) 40%, 
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 10px 30px -10px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 20px 40px -10px var(--pill-shadow-hover), 
      inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

.footer-giant-bg-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--foreground) 5%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, var(--foreground) 10%, transparent) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  background: linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklch, var(--foreground) 40%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px color-mix(in oklch, var(--foreground) 15%, transparent));
}
`;

export type MagneticButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      as?: React.ElementType;
    };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  (
    { className, children, as: Component = "button", ...props },
    forwardedRef
  ) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(element, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.4,
          });
        };
        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };
        element.addEventListener("mousemove", handleMouseMove as EventListener);
        element.addEventListener("mouseleave", handleMouseLeave);
        return () => {
          element.removeEventListener(
            "mousemove",
            handleMouseMove as EventListener
          );
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Tag = Component as any;
    return (
      <Tag
        ref={(node: HTMLElement) => {
          (localRef as React.MutableRefObject<HTMLElement | null>).current =
            node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef)
            (
              forwardedRef as React.MutableRefObject<HTMLElement | null>
            ).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>AI Interior Design</span> <span className="text-primary/60">✦</span>
    <span>Photorealistic Renders</span>{" "}
    <span className="text-secondary/60">✦</span>
    <span>20+ Design Styles</span> <span className="text-primary/60">✦</span>
    <span>Results in 30 Seconds</span>{" "}
    <span className="text-secondary/60">✦</span>
    <span>Layout Preserved</span> <span className="text-primary/60">✦</span>
  </div>
);

/* Windows logo */
const WindowsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="28"
    height="28"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 3.449L9.75 2.1v9.451H0" fill="#f35325" />
    <path d="M10.949 2.098L24 0v11.551H10.949" fill="#81bc06" />
    <path d="M0 12.6h9.75v9.451L0 20.699" fill="#05a6f0" />
    <path d="M10.949 12.6H24V24l-12.9-1.801" fill="#ffba08" />
  </svg>
);

/* Apple logo */
const AppleIcon = () => (
  <svg
    viewBox="0 0 814 1000"
    width="24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
    className="text-foreground"
    fill="currentColor"
  >
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.7-317.9 269-317.9 70.5 0 129.5 46.4 173.1 46.4 41.8 0 108.2-49.9 188.4-49.9 30.8.1 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
  </svg>
);

export function CinematicFooter({
  windowsHref = "#",
  macHref = "#",
}: {
  windowsHref?: string;
  macHref?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div
        ref={wrapperRef}
        className="relative h-screen w-full"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer className="bg-background text-foreground cinematic-footer-wrapper fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden">
          {/* Aurora + grid */}
          <div className="footer-aurora animate-footer-breathe pointer-events-none absolute top-1/2 left-1/2 z-0 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-[80px]" />
          <div className="footer-bg-grid pointer-events-none absolute inset-0 z-0" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text pointer-events-none absolute -bottom-[5vh] left-1/2 z-0 -translate-x-1/2 whitespace-nowrap select-none"
          >
            STUDIO
          </div>

          {/* Marquee */}
          <div className="border-border/50 bg-background/60 absolute top-12 left-0 z-10 w-full scale-110 -rotate-2 overflow-hidden border-y py-4 shadow-2xl backdrop-blur-md">
            <div className="animate-footer-scroll-marquee text-muted-foreground flex w-max text-xs font-bold tracking-[0.3em] uppercase md:text-sm">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 mx-auto mt-20 flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6">
            <h2
              ref={headingRef}
              className="footer-text-glow mb-4 text-center text-5xl font-black tracking-tighter md:text-8xl"
            >
              Download the App
            </h2>
            <p className="text-muted-foreground mb-12 text-center text-sm md:text-base">
              Native desktop experience · offline setup · cloud AI generation
            </p>

            <div
              ref={linksRef}
              className="flex w-full flex-col items-center gap-6"
            >
              {/* Primary download buttons */}
              <div className="flex w-full flex-wrap justify-center gap-4">
                <MagneticButton
                  as="a"
                  href={windowsHref}
                  className="footer-glass-pill text-foreground group flex items-center gap-4 rounded-2xl px-8 py-5 text-sm font-bold md:text-base"
                >
                  <WindowsIcon />
                  <div className="text-left">
                    <p className="text-muted-foreground group-hover:text-foreground/70 text-xs font-normal transition-colors">
                      Download for
                    </p>
                    <p className="font-bold">Windows</p>
                    <p className="text-muted-foreground text-xs font-normal">
                      Windows 10 / 11 · 64-bit
                    </p>
                  </div>
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href={macHref}
                  className="footer-glass-pill text-foreground group flex items-center gap-4 rounded-2xl px-8 py-5 text-sm font-bold md:text-base"
                >
                  <AppleIcon />
                  <div className="text-left">
                    <p className="text-muted-foreground group-hover:text-foreground/70 text-xs font-normal transition-colors">
                      Download for
                    </p>
                    <p className="font-bold">macOS</p>
                    <p className="text-muted-foreground text-xs font-normal">
                      macOS 13+ · Apple Silicon & Intel
                    </p>
                  </div>
                </MagneticButton>
              </div>

              {/* Secondary links */}
              <div className="mt-2 flex flex-wrap justify-center gap-3 md:gap-4">
                {[
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms of Service", href: "#" },
                  { label: "Help & Support", href: "/help" },
                ].map((l) => (
                  <MagneticButton
                    key={l.label}
                    as="a"
                    href={l.href}
                    className="footer-glass-pill text-muted-foreground hover:text-foreground rounded-full px-5 py-2.5 text-xs font-medium md:text-sm"
                  >
                    {l.label}
                  </MagneticButton>
                ))}
              </div>

              <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                <Lock className="h-3 w-3" />
                Free to download · Premium subscription required for AI
                generation
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative z-20 flex w-full flex-col items-center justify-between gap-4 px-6 pb-8 md:flex-row md:px-12">
            <div className="text-muted-foreground order-2 text-[10px] font-semibold tracking-widest uppercase md:order-1 md:text-xs">
              © {new Date().getFullYear()} Interior Designer AI. All rights
              reserved.
            </div>

            <div className="footer-glass-pill border-border/50 order-1 flex cursor-default items-center gap-2 rounded-full px-5 py-2.5 md:order-2">
              <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase md:text-xs">
                Crafted with
              </span>
              <span className="animate-footer-heartbeat text-destructive text-sm">
                ❤
              </span>
              <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase md:text-xs">
                for designers
              </span>
            </div>

            <MagneticButton
              as="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="footer-glass-pill text-muted-foreground hover:text-foreground group order-3 flex h-10 w-10 items-center justify-center rounded-full"
            >
              <svg
                className="h-4 w-4 transform transition-transform duration-300 group-hover:-translate-y-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}
