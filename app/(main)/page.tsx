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
import { TrustedBySection } from "@/components/trusted-by-section";

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

        {/* ── Download the App (top) ───────────────────────── */}
        <CinematicFooter windowsHref="#" macHref="#" />

        <div className="mx-auto w-full max-w-5xl space-y-16 px-6 py-16 pb-24 lg:px-8">
          {/* ── Hero ───────────────────────────────────────────── */}
          <section className="flex flex-col items-center gap-6 text-center">
            <div className="bg-background text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              AI-powered · No GPU required · Runs locally
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              High-quality architecture renders{" "}
              <span className="text-muted-foreground">in 30 seconds.</span> No
              GPU required.
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

            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-current"
                aria-hidden
              >
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.549H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
              </svg>
              Windows
              <span className="text-muted-foreground/40">&amp;</span>
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-current"
                aria-hidden
              >
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              macOS
              <span className="text-muted-foreground/40 mx-1">·</span>
              Available now
            </div>

            <div className="text-muted-foreground flex flex-wrap justify-center gap-x-8 gap-y-2 pt-2 text-sm">
              <span>🖥️ Runs locally</span>
              <span>·</span>
              <span>⚡ Renders in &lt; 30 s</span>
              <span>·</span>
              <span>20+ design styles</span>
            </div>
          </section>

          {/* ── Stats dashboard ───────────────────────────────── */}
          <StatsDashboard />

          {/* ── Live demo ─────────────────────────────────────── */}
          <LiveDemoSection />

          {/* ── Trusted by ────────────────────────────────── */}
          <TrustedBySection />

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
        </div>
      </div>

      {/* ── How it works ─────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-8">
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
    </>
  );
}
