"use client";

import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { ROOM_TYPES, DESIGN_THEMES } from "@/lib/constants";
import type { RoomType, DesignTheme } from "@/types";

interface DesignControlsProps {
  selectedTheme: DesignTheme;
  selectedRoom: RoomType;
  onThemeChange: (theme: DesignTheme) => void;
  onRoomChange: (room: RoomType) => void;
  onGenerate: () => void;
  isLoading: boolean;
  canGenerate: boolean;
  trialExhausted?: boolean;
}

export function DesignControls({
  selectedTheme,
  selectedRoom,
  onThemeChange,
  onRoomChange,
  onGenerate,
  isLoading,
  canGenerate,
  trialExhausted = false,
}: DesignControlsProps) {
  return (
    <>
      <div className="flex flex-col gap-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-xs font-semibold tracking-widest text-foreground/50 uppercase">Design Theme</label>
            <Combobox
              options={DESIGN_THEMES}
              value={selectedTheme}
              onValueChange={onThemeChange}
              placeholder="Select theme..."
              searchPlaceholder="Search themes..."
              emptyText="No theme found."
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label className="text-xs font-semibold tracking-widest text-foreground/50 uppercase">Room Type</label>
            <Combobox
              options={ROOM_TYPES}
              value={selectedRoom}
              onValueChange={onRoomChange}
              placeholder="Select room..."
              searchPlaceholder="Search rooms..."
              emptyText="No room found."
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mt-5 border-t border-foreground/8 pt-5">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="space-y-0.5 text-center sm:text-left">
              <p className="text-sm font-semibold text-foreground">Ready to redesign?</p>
              <p className="text-sm text-muted-foreground">
                {canGenerate ? "Click Generate to transform your room with AI." : "Upload a room photo to get started."}
              </p>
            </div>
            <Button
              size="lg"
              onClick={onGenerate}
              disabled={!canGenerate || isLoading}
              className="w-full shrink-0 rounded-xl bg-foreground text-background shadow-[0_6px_24px_rgba(99,102,241,0.25)] hover:bg-foreground/90 sm:w-auto"
            >
              <Wand2 className={isLoading ? "animate-pulse" : undefined} />
              {isLoading ? "Generating..." : trialExhausted ? "Generate (Activate Plan)" : "Generate Design"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
