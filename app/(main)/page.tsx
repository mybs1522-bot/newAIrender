import Link from "next/link";
import {
  Wand2,
  Sparkles,
  Palette,
  Zap,
  Shield,
  ArrowRight,
  ImageIcon,
  Layers,
  Camera,
  Download,
  Twitter,
  Linkedin,
  Github,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { GoogleAuth } from "@/components/google-auth";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { LiveDemoSection } from "@/components/live-demo-section";
import { StatsDashboard } from "@/components/stats-dashboard";
import { TrustedBySection } from "@/components/trusted-by-section";
import { BeforeAfterCards } from "@/components/ui/3d-card";
import { TestimonialsSection } from "@/components/testimonials-section";
import { Footer } from "@/components/ui/modem-animated-footer";
import { FundingAnnouncement } from "@/components/ui/funding-announcement";

const features = [
  {
    icon: Wand2,
    title: "AI-Powered Redesign",
    description:
      "Upload any room photo and our model reimagines the space with a completely new style — in seconds.",
  },
  {
    icon: Palette,
    title: "20+ Design Themes",
    description:
      "From Minimalist and Scandinavian to Industrial and Art Deco — every major interior style is covered.",
  },
  {
    icon: Camera,
    title: "Photorealistic Output",
    description:
      "DSLR-quality renders with sharp materials, accurate lighting, and no CGI haze.",
  },
  {
    icon: Layers,
    title: "Room-Aware Generation",
    description:
      "Select your room type and the AI adapts to furniture scale, lighting, and layout.",
  },
  {
    icon: Download,
    title: "Instant Download",
    description:
      "Every render is auto-saved to your gallery and downloaded at full resolution.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Photos are processed ephemerally and never stored or used for training.",
  },
];

const steps = [
  {
    number: "01",
    title: "Upload your room",
    body: "Drop a JPEG or PNG of any room — living room, bedroom, kitchen, or exterior.",
    icon: ImageIcon,
  },
  {
    number: "02",
    title: "Configure the design",
    body: "Pick from 20+ styles, set lighting mood, materials, and room type in 6 quick steps.",
    icon: Layers,
  },
  {
    number: "03",
    title: "Generate & download",
    body: "Hit Generate — your photorealistic render arrives and downloads automatically.",
    icon: Zap,
  },
];

export default function HomePage() {
  return (
    <>
      <div className="min-h-svh w-full bg-gray-50 dark:bg-transparent">
        {/* ── Navbar ─────────────────────────────────────────── */}
        <nav className="dark:bg-background/80 sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 lg:px-12 xl:px-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-background flex h-7 w-7 items-center justify-center rounded-lg border">
                <Palette className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-semibold">
                Interior Designer AI
              </span>
            </Link>
            <div className="text-muted-foreground hidden items-center gap-6 text-sm sm:flex">
              <Link
                href="#features"
                className="hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="hover:text-foreground transition-colors"
              >
                How it works
              </Link>
              <Link
                href="#download"
                className="hover:text-foreground transition-colors"
              >
                Download
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <GoogleAuth />
              <Button asChild size="sm" className="hidden sm:flex">
                <Link href="/render">
                  <Sparkles className="h-3.5 w-3.5" />
                  Open Studio
                </Link>
              </Button>
            </div>
          </div>
        </nav>

        {/* ── Download the App (top) ───────────────────────── */}
        <CinematicFooter windowsHref="#" macHref="#" />

        <div className="mx-auto w-full max-w-7xl space-y-20 px-6 py-16 pb-24 lg:space-y-28 lg:px-12 lg:py-24 xl:px-16">
          {/* ── Funding announcement ───────────────────────── */}
          <FundingAnnouncement />

          {/* ── Before / After cards ─────────────────────────── */}
          <div className="flex justify-center py-4">
            <BeforeAfterCards />
          </div>

          {/* ── How it works ─────────────────────────────────── */}
          <section
            id="how-it-works"
            className="bg-background rounded-2xl border px-6 py-12 sm:px-12 lg:px-20 lg:py-20"
          >
            <div className="mb-10 text-center lg:mb-16">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl xl:text-5xl">
                How it works
              </h2>
              <p className="text-muted-foreground mt-2 text-sm lg:mt-4 lg:text-base">
                Three steps from photo to polished design.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3 lg:gap-14">
              {steps.map((s) => (
                <div
                  key={s.number}
                  className="flex flex-col items-center gap-4 text-center lg:gap-6"
                >
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border before:absolute before:-inset-2 before:rounded-full before:border lg:h-20 lg:w-20 dark:border-white/10 dark:before:border-white/5">
                    <s.icon
                      className="h-5 w-5 lg:h-8 lg:w-8"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                      {s.number}
                    </p>
                    <p className="mt-1 font-medium lg:mt-2 lg:text-xl">
                      {s.title}
                    </p>
                    <p className="text-muted-foreground mt-1.5 text-sm leading-6 lg:mt-3 lg:text-base lg:leading-7">
                      {s.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Stats dashboard ───────────────────────────────── */}
          <StatsDashboard />

          {/* ── Trusted by ────────────────────────────────── */}
          <TrustedBySection />

          {/* ── Testimonials ──────────────────────────────── */}
          <TestimonialsSection />
        </div>
      </div>

      {/* ── Site footer ─────────────────────────────────────── */}
      <Footer
        brandName="Interior Designer AI"
        brandDescription="Transform any room photo into a photorealistic AI render in 30 seconds. No GPU required — runs entirely on your device."
        socialLinks={[
          {
            icon: <Twitter className="h-6 w-6" />,
            href: "https://twitter.com",
            label: "Twitter",
          },
          {
            icon: <Linkedin className="h-6 w-6" />,
            href: "https://linkedin.com",
            label: "LinkedIn",
          },
          {
            icon: <Github className="h-6 w-6" />,
            href: "https://github.com",
            label: "GitHub",
          },
          {
            icon: <Mail className="h-6 w-6" />,
            href: "mailto:hello@interiordesigner.ai",
            label: "Email",
          },
        ]}
        navLinks={[
          { label: "Render Studio", href: "/render" },
          { label: "Help & Support", href: "/help" },
          { label: "Settings", href: "/settings" },
          { label: "Privacy Policy", href: "#" },
          { label: "Terms of Service", href: "#" },
        ]}
        brandIcon={
          <Palette className="text-background h-8 w-8 drop-shadow-lg sm:h-10 sm:w-10 md:h-14 md:w-14" />
        }
      />
    </>
  );
}
