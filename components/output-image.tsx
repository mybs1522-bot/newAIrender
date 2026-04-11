"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { saveAs } from "file-saver";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SpiralAnimation } from "@/components/ui/spiral-animation";

function RenderLoader() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem]">
      <SpiralAnimation />
      {/* CREATING overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span
          className="animate-pulse text-2xl font-extralight tracking-[0.35em] text-white uppercase select-none"
          style={{ textShadow: "0 0 30px rgba(255,255,255,0.4)" }}
        >
          CREATING
        </span>
      </div>
    </div>
  );
}

interface OutputImageProps {
  src: string | null;
  isLoading: boolean;
  subscribed?: boolean;
}

export function OutputImage({
  src,
  isLoading,
  subscribed = false,
}: OutputImageProps) {
  const handleDownload = () => {
    if (src && subscribed) {
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
          title={subscribed ? "Download" : "Start a plan to download"}
          disabled={!subscribed}
          className="absolute top-2 right-2 border border-white/15 bg-white/20 backdrop-blur-xl hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          <span className="sr-only">Download image</span>
        </Button>
      </CardContent>
    </Card>
  );
}
