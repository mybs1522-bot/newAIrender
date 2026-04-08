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
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { GoogleAuth } from "@/components/google-auth";

const features = [
  {
    icon: Wand2,
    title: "AI-Powered Redesign",
    description: "Upload any room photo and our model reimagines the space with a completely new style — in seconds.",
  },
  {
    icon: Palette,
    title: "20+ Design Themes",
    description: "From Minimalist and Scandinavian to Industrial and Art Deco — every major interior style is covered.",
  },
  {
    icon: Camera,
    title: "Photorealistic Output",
    description: "DSLR-quality renders with sharp materials, accurate lighting, and no CGI haze.",
  },
  {
    icon: Layers,
    title: "Room-Aware Generation",
    description: "Select your room type and the AI adapts to furniture scale, lighting, and layout.",
  },
  {
    icon: Download,
    title: "Instant Download",
    description: "Every render is auto-saved to your gallery and downloaded at full resolution.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Photos are processed ephemerally and never stored or used for training.",
  },
];

const steps = [
  { number: "01", title: "Upload your room", body: "Drop a JPEG or PNG of any room — living room, bedroom, kitchen, or exterior.", icon: ImageIcon },
  { number: "02", title: "Configure the design", body: "Pick from 20+ styles, set lighting mood, materials, and room type in 6 quick steps.", icon: Layers },
  { number: "03", title: "Generate & download", body: "Hit Generate — your photorealistic render arrives and downloads automatically.", icon: Zap },
];

export default function HomePage() {
  return (
    <div className="min-h-svh bg-gray-50 dark:bg-transparent">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:bg-background/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border bg-background">
              <Palette className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-semibold">Interior Designer AI</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <Link href="#features" className="transition-colors hover:text-foreground">Features</Link>
            <Link href="#how-it-works" className="transition-colors hover:text-foreground">How it works</Link>
            <Link href="#download" className="transition-colors hover:text-foreground">Download</Link>
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
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Powered by Google Nano Banana Pro
          </div>

          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Redesign any room with{" "}
            <span className="text-muted-foreground">artificial intelligence</span>
          </h1>

          <p className="max-w-lg text-base leading-7 text-muted-foreground">
            Upload a photo, configure your design style, and receive a photorealistic
            render — indistinguishable from a real photograph.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2 px-6">
              <Link href="/render">
                <Sparkles className="h-4 w-4" />
                Open Web Studio
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 px-6">
              <Link href="#how-it-works">How it works</Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 pt-2 text-sm text-muted-foreground">
            <span>20+ design styles</span>
            <span>·</span>
            <span>Results in &lt; 30 seconds</span>
            <span>·</span>
            <span>100% layout preserved</span>
          </div>
        </section>

        {/* ── Download (below hero) ────────────────────────────── */}
        <section id="download" className="-mt-4">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Download the Desktop App</h2>
            <p className="mt-2 text-sm text-muted-foreground">Native experience — offline setup, cloud generation.</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            {/* Windows */}
            <a href="#" className="flex flex-1 max-w-xs items-center gap-4 rounded-xl border bg-background p-5 transition-colors hover:bg-muted/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.551H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" fill="#00adef"/>
                  <path d="M0 3.449L9.75 2.1v9.451H0" fill="#f35325"/>
                  <path d="M10.949 2.098L24 0v11.551H10.949" fill="#81bc06"/>
                  <path d="M0 12.6h9.75v9.451L0 20.699" fill="#05a6f0"/>
                  <path d="M10.949 12.6H24V24l-12.9-1.801" fill="#ffba08"/>
                  <path d="M0 3.449L9.75 2.1v9.451H0" fill="#f35325"/>
                  <path d="M10.949 2.098L24 0v11.551H10.949" fill="#81bc06"/>
                  <path d="M0 12.6h9.75v9.451L0 20.699" fill="#05a6f0"/>
                  <path d="M10.949 12.6H24V24l-12.9-1.801" fill="#ffba08"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Download for</p>
                <p className="font-semibold">Windows</p>
                <p className="text-xs text-muted-foreground">Windows 10 / 11 · 64-bit</p>
              </div>
            </a>
            {/* macOS */}
            <a href="#" className="flex flex-1 max-w-xs items-center gap-4 rounded-xl border bg-background p-5 transition-colors hover:bg-muted/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 814 1000" width="26" height="26">
                  <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.7-317.9 269-317.9 70.5 0 129.5 46.4 173.1 46.4 41.8 0 108.2-49.9 188.4-49.9 30.8.1 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" fill="#555"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Download for</p>
                <p className="font-semibold">macOS</p>
                <p className="text-xs text-muted-foreground">macOS 13+ · Apple Silicon & Intel</p>
              </div>
            </a>
          </div>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            Free to download · Premium subscription required for AI generation
          </p>
        </section>

        {/* ── Features bento ─────────────────────────────────── */}
        <section id="features">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Everything you need</h2>
            <p className="mt-2 text-sm text-muted-foreground">Powerful features wrapped in a simple interface.</p>
          </div>

          <div className="grid grid-cols-6 gap-3">
            {/* Large card — first feature */}
            <Card className="col-span-full lg:col-span-2">
              <CardContent className="flex h-full flex-col justify-between p-6">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border">
                  <Wand2 className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <div className="mt-6 space-y-1">
                  <h3 className="font-medium">AI-Powered Redesign</h3>
                  <p className="text-sm text-muted-foreground">Upload any room photo and our model reimagines the space with a completely new style — in seconds.</p>
                </div>
              </CardContent>
            </Card>

            {/* Mid cards */}
            {features.slice(1, 3).map((f) => (
              <Card key={f.title} className="col-span-full sm:col-span-3 lg:col-span-2">
                <CardContent className="flex h-full flex-col justify-between p-6">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                    <f.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div className="mt-6 space-y-1">
                    <h3 className="font-medium">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
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
                    <p className="text-xs text-muted-foreground">{f.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────── */}
        <section id="how-it-works" className="rounded-xl border bg-background px-6 py-12 sm:px-12">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How it works</h2>
            <p className="mt-2 text-sm text-muted-foreground">Three steps from photo to polished design.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.number} className="flex flex-col items-center gap-4 text-center">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                  <s.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{s.number}</p>
                  <p className="mt-1 font-medium">{s.title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ── Bottom CTA ──────────────────────────────────────── */}
        <section className="flex flex-col items-center gap-5 rounded-xl border bg-background px-6 py-14 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ready to transform your space?</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Open the studio, upload your first photo, and see photorealistic AI rendering in action.
          </p>
          <Button asChild size="lg" className="gap-2 px-8">
            <Link href="/render">
              <Wand2 className="h-4 w-4" />
              Try the Studio Free
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground">No credit card required · Results in under 30 seconds</p>
        </section>

      </div>
    </div>
  );
}
