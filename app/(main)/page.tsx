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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { GoogleAuth } from "@/components/google-auth";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { LiveDemoSection } from "@/components/live-demo-section";
import { StatsDashboard } from "@/components/stats-dashboard";

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
      <div className="min-h-svh bg-gray-50 dark:bg-transparent">
        {/* ── Navbar ─────────────────────────────────────────── */}
        <nav className="dark:bg-background/80 sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3 lg:px-8">
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

        <div className="mx-auto w-full max-w-5xl space-y-16 px-6 py-16 pb-24 lg:px-8">
          {/* ── Hero ───────────────────────────────────────────── */}
          <section className="flex flex-col items-center gap-6 text-center">
            <div className="bg-background text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              No GPU required · Runs locally in 30 s
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Stop paying for{" "}
              <span className="text-muted-foreground">expensive renders.</span>{" "}
              Get them in 30 seconds — free.
            </h1>

            <p className="text-muted-foreground max-w-xl text-base leading-7">
              No costly GPU. No bloated rendering software. Avada runs entirely
              on your laptop and transforms any room photo into a photorealistic
              AI render — indistinguishable from the real thing.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2 px-6">
                <Link href="/render">
                  <Sparkles className="h-4 w-4" />
                  Open Web Studio
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 px-6"
              >
                <Link href="#how-it-works">How it works</Link>
              </Button>
            </div>

            <div className="text-muted-foreground flex flex-wrap justify-center gap-x-8 gap-y-2 pt-2 text-sm">
              <span>🖥️ Runs 100% locally</span>
              <span>·</span>
              <span>⚡ Renders in &lt; 30 s</span>
              <span>·</span>
              <span>💸 No subscription needed</span>
              <span>·</span>
              <span>20+ design styles</span>
            </div>
          </section>

          {/* ── Stats dashboard ───────────────────────────────── */}
          <StatsDashboard />

          {/* ── Live demo ─────────────────────────────────────── */}
          <LiveDemoSection />

          {/* ── Features bento ─────────────────────────────────── */}
          <section id="features">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Everything you need
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Powerful features wrapped in a simple interface.
              </p>
            </div>

            <div className="grid grid-cols-6 gap-3">
              {/* Large card — first feature */}
              <Card className="col-span-full lg:col-span-2">
                <CardContent className="flex h-full flex-col justify-between p-6">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border">
                    <Wand2
                      className="text-muted-foreground h-8 w-8"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="mt-6 space-y-1">
                    <h3 className="font-medium">AI-Powered Redesign</h3>
                    <p className="text-muted-foreground text-sm">
                      Upload any room photo and our model reimagines the space
                      with a completely new style — in seconds.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Mid cards */}
              {features.slice(1, 3).map((f) => (
                <Card
                  key={f.title}
                  className="col-span-full sm:col-span-3 lg:col-span-2"
                >
                  <CardContent className="flex h-full flex-col justify-between p-6">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                      <f.icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div className="mt-6 space-y-1">
                      <h3 className="font-medium">{f.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {f.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Bottom row */}
              {features.slice(3).map((f) => (
                <Card key={f.title} className="col-span-full sm:col-span-2">
                  <CardContent className="flex h-full flex-col justify-between p-6">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full border dark:border-white/10">
                      <f.icon className="h-4 w-4" strokeWidth={1.5} />
                    </div>
                    <div className="mt-6 space-y-1">
                      <h3 className="text-sm font-medium">{f.title}</h3>
                      <p className="text-muted-foreground text-xs">
                        {f.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ── How it works ────────────────────────────────────── */}
          <section
            id="how-it-works"
            className="bg-background rounded-xl border px-6 py-12 sm:px-12"
          >
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                How it works
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Three steps from photo to polished design.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {steps.map((s) => (
                <div
                  key={s.number}
                  className="flex flex-col items-center gap-4 text-center"
                >
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                    <s.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                      {s.number}
                    </p>
                    <p className="mt-1 font-medium">{s.title}</p>
                    <p className="text-muted-foreground mt-1.5 text-sm leading-6">
                      {s.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <CinematicFooter windowsHref="#" macHref="#" />
    </>
  );
}
