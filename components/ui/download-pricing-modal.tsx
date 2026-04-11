"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PricingCard } from "@/components/ui/pricing-card";

interface DownloadPricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform?: "windows" | "mac";
  windowsHref?: string;
  macHref?: string;
}

export function DownloadPricingModal({
  open,
  onOpenChange,
  platform,
  windowsHref = "#",
  macHref = "#",
}: DownloadPricingModalProps) {
  const handleStartTrial = () => {
    const href = platform === "windows" ? windowsHref : macHref;
    onOpenChange(false);
    if (href && href !== "#") {
      window.location.href = href;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-background max-w-[500px] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-bold">
            Activate trial to download
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Start your 7-day free trial to download the app and begin rendering.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pt-4 pb-6">
          <PricingCard onStartTrial={handleStartTrial} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
