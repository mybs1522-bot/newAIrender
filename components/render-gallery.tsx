"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Download, X, ChevronLeft, ChevronRight, Images, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RenderEntry } from "@/hooks/useRenderHistory";

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

async function downloadImage(url: string, filename: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  } catch {
    window.open(url, "_blank");
  }
}

/* ─── Lightbox ─────────────────────────────────────────────────── */
function Lightbox({
  entries,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  entries: RenderEntry[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const entry = entries[index];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white/80">
            {entry.style} · {entry.roomType} · {formatTime(entry.createdAt)}
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-xl text-white hover:bg-white/20"
              onClick={() => downloadImage(entry.outputUrl, `render-${entry.id}.jpg`)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-xl text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-black/40" style={{ aspectRatio: "16/10" }}>
          <img src={entry.outputUrl} alt="Render" className="w-full h-full object-contain" />
        </div>

        {/* Prev / Next */}
        {entries.length > 1 && (
          <div className="flex items-center justify-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-xl text-white hover:bg-white/20"
              onClick={onPrev}
              disabled={index === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-xs text-white/50">{index + 1} / {entries.length}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-xl text-white hover:bg-white/20"
              onClick={onNext}
              disabled={index === entries.length - 1}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Gallery ──────────────────────────────────────────────── */
interface Props {
  entries: RenderEntry[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export function RenderGallery({ entries, onRemove, onClearAll }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (entries.length === 0) return null;

  return (
    <>
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          entries={entries}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => Math.max(0, (i ?? 1) - 1))}
          onNext={() => setLightboxIndex((i) => Math.min(entries.length - 1, (i ?? 0) + 1))}
        />
      )}

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
            <Images className="h-4 w-4" />
            Render Gallery
            <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium">
              {entries.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-7 rounded-lg px-2.5 text-xs text-muted-foreground hover:text-destructive"
          >
            Clear all
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {entries.map((entry, i) => (
            <div
              key={entry.id}
              className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 cursor-pointer"
              onClick={() => setLightboxIndex(i)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={entry.outputUrl}
                  alt={`${entry.style} ${entry.roomType}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 flex flex-col justify-between p-2.5 opacity-0 transition-opacity group-hover:opacity-100 bg-black/40">
                <div className="flex justify-end gap-1">
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
                    onClick={(e) => { e.stopPropagation(); downloadImage(entry.outputUrl, `render-${entry.id}.jpg`); }}
                    title="Download"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm hover:bg-red-500/60 transition-colors"
                    onClick={(e) => { e.stopPropagation(); onRemove(entry.id); }}
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <p className="truncate text-xs font-semibold text-white">{entry.style} · {entry.roomType}</p>
                  <p className="flex items-center gap-1 text-[10px] text-white/60 mt-0.5">
                    <Clock className="h-2.5 w-2.5" />
                    {formatTime(entry.createdAt)}
                  </p>
                </div>
              </div>

              {/* Space type badge */}
              <div className={cn(
                "absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                entry.spaceType === "exterior"
                  ? "bg-emerald-500/80 text-white"
                  : "bg-indigo-500/80 text-white"
              )}>
                {entry.spaceType}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
