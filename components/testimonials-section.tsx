"use client";
import React from "react";
import { motion } from "motion/react";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

const testimonials = [
  {
    text: "I used to spend 3–4 hours per render on my workstation. Now I get photorealistic outputs in under a minute — from my laptop on a job site. It's completely changed how I present to clients.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
    name: "Priya Sharma",
    role: "Senior Interior Designer, Mumbai",
  },
  {
    text: "We were about to invest $6,000 in a new GPU workstation just for rendering. This tool saved us that entire budget. The results are indistinguishable from what our old setup produced.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
    name: "James Caldwell",
    role: "Principal Architect, London",
  },
  {
    text: "Clients can now see multiple style options in the same meeting. Before, I'd have to go back to the office and wait overnight. This tool makes live design exploration possible.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
    name: "Sofia Moreno",
    role: "Residential Designer, Barcelona",
  },
  {
    text: "The photorealistic quality surprised me. Materials, shadows, lighting — it looks like a professional Lumion or V-Ray render. No GPU, no plugins, no headaches.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
    name: "Tariq Al-Farsi",
    role: "Architectural Visualizer, Dubai",
  },
  {
    text: "I run a solo design studio. I can't afford a $5K render PC. This lets me compete with larger firms on presentation quality — and my clients have no idea I'm using a MacBook Air.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80",
    name: "Hannah Kowalski",
    role: "Freelance Interior Designer, Warsaw",
  },
  {
    text: "We integrated this into our concept approval workflow. Clients approve designs 40% faster because they can actually visualise the final space, not just look at floor plans.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
    name: "Luca Ferretti",
    role: "Design Director, Milan",
  },
  {
    text: "As an architect, accurate material representation is everything. I was sceptical but the wood grain, tile reflections, and fabric textures are genuinely impressive. My team uses it daily.",
    image:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&q=80",
    name: "Aisha Okonkwo",
    role: "Architect & Educator, Lagos",
  },
  {
    text: "The 20+ design styles save me so much time scoping a project. I show clients Scandinavian vs. Industrial vs. Coastal in minutes. That used to take a full day of work.",
    image:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&q=80",
    name: "Ethan Brooks",
    role: "Commercial Interior Designer, NYC",
  },
  {
    text: "We switched from outsourcing renders at $150 per image to doing it in-house with this tool. We're saving over $2,000 a month and turnaround is same-day now.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80",
    name: "Mei-Lin Chen",
    role: "Studio Owner, Singapore",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function TestimonialsSection() {
  return (
    <section className="relative my-20">
      <div className="z-10 container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[540px] flex-col items-center justify-center"
        >
          <div className="flex justify-center">
            <div className="rounded-lg border px-4 py-1 text-sm font-medium">
              Testimonials
            </div>
          </div>
          <h2 className="mt-5 text-center text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            What designers & architects say
          </h2>
          <p className="text-muted-foreground mt-5 text-center lg:text-lg">
            Real feedback from interior designers and architects who replaced
            expensive GPU setups with our AI renderer.
          </p>
        </motion.div>

        <div className="mt-10 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] lg:max-h-[900px] lg:gap-8">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
}
