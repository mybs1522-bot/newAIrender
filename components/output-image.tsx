"use client";

import Image from "next/image";
import { Download, Sparkles } from "lucide-react";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STAGES = [
  "Analyzing your design…",
  "Applying materials & textures…",
  "Rendering photorealistic lighting…",
  "Calculating shadows & reflections…",
  "Adding photographic detail…",
  "Finalizing your render…",
];

function RenderLoader() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem]">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-indigo-500/10 to-pink-500/10" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(139,92,246,0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(99,102,241,0.2) 0%, transparent 55%)",
        }}
      />

      {/* Shimmer sweep */}
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2.2s_infinite]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
        }}
      />

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
        {/* Rotating rings + pulsing orb */}
        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute h-24 w-24 rounded-full border-2 border-violet-400/20 animate-[spin_4s_linear_infinite]" />
          {/* Mid ring */}
          <div className="absolute h-16 w-16 rounded-full border-2 border-indigo-400/30 border-t-indigo-400/80 animate-[spin_2s_linear_infinite]" />
          {/* Inner ring */}
          <div className="absolute h-10 w-10 rounded-full border-2 border-pink-400/30 border-b-pink-400/80 animate-[spin_1.2s_linear_infinite_reverse]" />
          {/* Core orb */}
          <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 shadow-[0_0_20px_rgba(139,92,246,0.6)] animate-pulse">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
        </div>

        {/* Stage label */}
        <div className="flex flex-col items-center gap-1.5">
          <p
            key={stage}
            className="text-sm font-medium text-foreground/80 animate-[fadeIn_0.4s_ease]"
            style={{ animation: "fadeIn 0.4s ease" }}
          >
            {STAGES[stage]}
          </p>
          {/* Dot progress */}
          <div className="flex items-center gap-1.5 mt-1">
            {STAGES.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: i === stage ? "20px" : "6px",
                  background: i === stage
                    ? "linear-gradient(90deg, #8b5cf6, #6366f1)"
                    : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Corner shimmer blocks (skeleton lines) */}
      <div className="absolute bottom-4 left-4 right-4 space-y-2 opacity-30">
        <div className="h-1.5 w-3/4 rounded-full bg-white/20" />
        <div className="h-1.5 w-1/2 rounded-full bg-white/15" />
      </div>

      <style>{`
        @keyframes shimmer { to { transform: translateX(200%) } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes reverse { to { transform: rotate(-360deg); } }
      `}</style>
    </div>
  );
}

interface OutputImageProps {
  src: string | null;
  isLoading: boolean;
}

export function OutputImage({ src, isLoading }: OutputImageProps) {
  const handleDownload = () => {
    if (src) {
      saveAs(src, "interior-design.png");
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-panel overflow-hidden rounded-[1.5rem] border-white/15">
        <CardContent className="p-0">
          <RenderLoader />
        </CardContent>
      </Card>
    );
  }

  if (!src) {
    return (
      <Card className="glass-panel rounded-[1.5rem] border-2 border-dashed border-white/20 hover:border-white/35">
        <CardContent className="flex aspect-[4/3] items-center justify-center p-8">
          <p className="text-muted-foreground text-center">
            Your AI-generated design will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel overflow-hidden rounded-[1.5rem] border-white/15">
      <CardContent className="relative p-0">
        <div className="relative aspect-[4/3]">
          <Image
            fill
            src={src}
            alt="AI generated design"
            className="object-cover"
          />
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 border border-white/15 bg-white/20 backdrop-blur-xl hover:bg-white/30"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          <span className="sr-only">Download image</span>
        </Button>
      </CardContent>
    </Card>
  );
}
