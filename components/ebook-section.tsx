"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Zap, Star, ArrowRight } from "lucide-react";

const perks = [
  {
    icon: TrendingUp,
    title: "Boost Your Income",
    body: "Designers who master these techniques charge 2–3× more. The knowledge pays for itself in your very first project.",
  },
  {
    icon: BookOpen,
    title: "Expert-Crafted eBooks",
    body: "Distilled from years of real studio experience. No fluff — just the strategies that actually move the needle.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    body: "Start applying what you learn the same day. Our guides are built for action, not just reading.",
  },
];

export function EbookSection() {
  return (
    <section className="w-full">
      <div className="border-border from-primary/5 via-background to-primary/10 rounded-2xl border bg-gradient-to-br px-8 py-14 lg:px-16 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ── Left: copy ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            {/* eyebrow */}
            <div className="border-primary/30 bg-primary/10 text-primary inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold">
              <Star className="fill-primary h-3.5 w-3.5" />
              For every skill level
            </div>

            {/* headline */}
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl leading-tight font-black tracking-tight sm:text-4xl lg:text-5xl">
                Boost Your Design Career{" "}
                <span className="text-primary">and Income.</span>
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed lg:text-lg">
                Dive into our{" "}
                <span className="text-foreground font-semibold">
                  expert-crafted eBooks
                </span>{" "}
                and finally master the industry secrets your competition
                doesn&apos;t know about. Enhance your design capabilities,
                command higher rates, and{" "}
                <span className="text-foreground font-semibold">
                  increase your earnings with just a click.
                </span>
              </p>
              <p className="text-muted-foreground text-base leading-relaxed lg:text-lg">
                Surprise your peers. Elevate your professional standing.{" "}
                <span className="text-foreground font-semibold">
                  Start your transformation today.
                </span>
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" className="gap-2 text-base font-bold">
                Get the eBooks Now
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-muted-foreground text-sm">
                Instant PDF download · Cancel anytime
              </p>
            </div>
          </motion.div>

          {/* ── Right: perks ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: true }}
                className="border-border bg-background/60 flex gap-5 rounded-2xl border p-6 backdrop-blur-sm"
              >
                <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                  <perk.icon className="text-primary h-6 w-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-base font-bold">{perk.title}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {perk.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
