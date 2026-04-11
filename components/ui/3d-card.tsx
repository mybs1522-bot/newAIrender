"use client";

import React, { useState, useEffect } from "react";

interface PhotoCardProps {
  src: string;
  alt: string;
  rotation: number;
  label: string;
  index: number;
  style?: React.CSSProperties;
  isActive: boolean;
}

const PhotoCard = ({
  src,
  alt,
  rotation,
  label,
  index,
  style = {},
  isActive,
}: PhotoCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400 + index * 250);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className="absolute h-[220px] w-[150px] rounded-md bg-white p-2 shadow-2xl dark:bg-zinc-900"
      style={{
        transform: `rotate(${rotation}deg) scale(${isActive ? 1.07 : 1})`,
        zIndex: isActive ? 20 : 1,
        transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        opacity: isVisible ? 1 : 0,
        ...style,
      }}
    >
      <div className="relative h-[82%] w-full overflow-hidden rounded-sm">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/150x180/e2e8f0/94a3b8?text=Image";
          }}
        />
        <span
          className={`absolute top-1.5 left-1.5 rounded px-1.5 py-0.5 text-[10px] font-bold tracking-widest uppercase ${
            label === "After"
              ? "bg-green-600 text-white"
              : "bg-black/60 text-white"
          }`}
        >
          {label}
        </span>
      </div>
      <div className="flex h-[18%] items-center justify-center">
        <p className="text-muted-foreground truncate px-1 text-center text-[10px] font-medium">
          AI Interior Design
        </p>
      </div>
    </div>
  );
};

const AnimatedGrid = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 0.5) % 40);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, transparent 0%, #ffffff 60%, #ffffff 100%),
            linear-gradient(#e5e7eb 1px, transparent 1px),
            linear-gradient(90deg, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: "cover, 40px 40px, 40px 40px",
          backgroundPosition: `center, ${offset}px ${offset}px, ${offset}px ${offset}px`,
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, transparent 0%, #0f172a 60%, #0f172a 100%),
            linear-gradient(#374151 1px, transparent 1px),
            linear-gradient(90deg, #374151 1px, transparent 1px)
          `,
          backgroundSize: "cover, 40px 40px, 40px 40px",
          backgroundPosition: `center, ${offset}px ${offset}px, ${offset}px ${offset}px`,
        }}
      />
    </div>
  );
};

export function BeforeAfterCards() {
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === 0 ? 1 : 0));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-[300px] w-[300px] items-center justify-center">
      <AnimatedGrid />

      {/* Before card */}
      <PhotoCard
        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80"
        alt="Before: plain room"
        rotation={-10}
        label="Before"
        index={0}
        isActive={activeIndex === 0}
        style={{ top: "28px", left: "10px" }}
      />

      {/* After card */}
      <PhotoCard
        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80"
        alt="After: AI rendered room"
        rotation={10}
        label="After"
        index={1}
        isActive={activeIndex === 1}
        style={{ top: "14px", right: "10px" }}
      />
    </div>
  );
}
