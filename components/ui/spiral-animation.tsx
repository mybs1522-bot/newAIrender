"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/* ─── Vector helpers ─────────────────────────────────────────────────────── */
class Vector2D {
  constructor(
    public x: number,
    public y: number
  ) {}
}

class Vector3D {
  constructor(
    public x: number,
    public y: number,
    public z: number
  ) {}
}

/* ─── Star ───────────────────────────────────────────────────────────────── */
class Star {
  private dx: number;
  private dy: number;
  private spiralLocation: number;
  private strokeWeightFactor: number;
  private z: number;
  private angle: number;
  private distance: number;
  private rotationDirection: number;
  private expansionRate: number;
  private finalScale: number;

  constructor(cameraZ: number, cameraTravelDistance: number) {
    this.angle = Math.random() * Math.PI * 2;
    this.distance = 30 * Math.random() + 15;
    this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
    this.expansionRate = 1.2 + Math.random() * 0.8;
    this.finalScale = 0.7 + Math.random() * 0.6;
    this.dx = this.distance * Math.cos(this.angle);
    this.dy = this.distance * Math.sin(this.angle);
    this.spiralLocation = (1 - Math.pow(1 - Math.random(), 3.0)) / 1.3;
    const raw =
      cameraZ * 0.5 +
      Math.random() * (cameraTravelDistance + cameraZ - cameraZ * 0.5);
    this.z =
      raw * (1 - 0.3 * this.spiralLocation) +
      (cameraTravelDistance / 2) * 0.3 * this.spiralLocation;
    this.strokeWeightFactor = Math.pow(Math.random(), 2.0);
  }

  render(p: number, ctrl: AnimationController) {
    const spiralPos = ctrl.spiralPath(this.spiralLocation);
    const q = p - this.spiralLocation;
    if (q <= 0) return;

    const dp = ctrl.constrain(4 * q, 0, 1);
    const linear = dp;
    const elastic = ctrl.easeOutElastic(dp);
    const power = Math.pow(dp, 2);

    let easing: number;
    if (dp < 0.3) easing = ctrl.lerp(linear, power, dp / 0.3);
    else if (dp < 0.7) easing = ctrl.lerp(power, elastic, (dp - 0.3) / 0.4);
    else easing = elastic;
    void easing;

    let sx: number, sy: number;
    if (dp < 0.3) {
      const t = dp / 0.3;
      sx = ctrl.lerp(spiralPos.x, spiralPos.x + this.dx * 0.3, t);
      sy = ctrl.lerp(spiralPos.y, spiralPos.y + this.dy * 0.3, t);
    } else if (dp < 0.7) {
      const t = (dp - 0.3) / 0.4;
      const curve = Math.sin(t * Math.PI) * this.rotationDirection * 1.5;
      const bx = spiralPos.x + this.dx * 0.3,
        by = spiralPos.y + this.dy * 0.3;
      const tx = spiralPos.x + this.dx * 0.7,
        ty = spiralPos.y + this.dy * 0.7;
      sx = ctrl.lerp(bx, tx, t) + -this.dy * 0.4 * curve * t;
      sy = ctrl.lerp(by, ty, t) + this.dx * 0.4 * curve * t;
    } else {
      const t = (dp - 0.7) / 0.3;
      const bx = spiralPos.x + this.dx * 0.7,
        by = spiralPos.y + this.dy * 0.7;
      const td = this.distance * this.expansionRate * 1.5;
      const sa = this.angle + 1.2 * this.rotationDirection * t * Math.PI;
      sx = ctrl.lerp(bx, spiralPos.x + td * Math.cos(sa), t);
      sy = ctrl.lerp(by, spiralPos.y + td * Math.sin(sa), t);
    }

    const vx = ((this.z - ctrl["cameraZ"]) * sx) / ctrl["viewZoom"];
    const vy = ((this.z - ctrl["cameraZ"]) * sy) / ctrl["viewZoom"];

    let size = 1.0;
    if (dp < 0.6) size = 1.0 + dp * 0.2;
    else size = ctrl.lerp(1.2, this.finalScale, (dp - 0.6) / 0.4);

    ctrl.showProjectedDot(
      new Vector3D(vx, vy, this.z),
      8.5 * this.strokeWeightFactor * size
    );
  }
}

/* ─── AnimationController ────────────────────────────────────────────────── */
class AnimationController {
  private timeline: gsap.core.Timeline;
  private time = 0;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private stars: Star[] = [];

  private readonly changeEventTime = 0.32;
  private readonly cameraZ = -400;
  private readonly cameraTravelDistance = 3400;
  private readonly startDotYOffset = 28;
  private readonly viewZoom = 100;
  private readonly numberOfStars = 5000;
  private readonly trailLength = 80;
  private readonly size: number;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    size: number
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.size = size;
    this.timeline = gsap.timeline({ repeat: -1 });
    this.seedStars();
    this.timeline.to(this, {
      time: 1,
      duration: 15,
      repeat: -1,
      ease: "none",
      onUpdate: () => this.render(),
    });
  }

  private seedStars() {
    const orig = Math.random;
    let seed = 1234;
    Math.random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < this.numberOfStars; i++)
      this.stars.push(new Star(this.cameraZ, this.cameraTravelDistance));
    Math.random = orig;
  }

  ease(p: number, g: number) {
    return p < 0.5
      ? 0.5 * Math.pow(2 * p, g)
      : 1 - 0.5 * Math.pow(2 * (1 - p), g);
  }

  easeOutElastic(x: number) {
    const c4 = (2 * Math.PI) / 4.5;
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return Math.pow(2, -8 * x) * Math.sin((x * 8 - 0.75) * c4) + 1;
  }

  constrain(v: number, mn: number, mx: number) {
    return Math.min(Math.max(v, mn), mx);
  }
  lerp(a: number, b: number, t: number) {
    return a * (1 - t) + b * t;
  }
  map(v: number, s1: number, e1: number, s2: number, e2: number) {
    return s2 + (e2 - s2) * ((v - s1) / (e1 - s1));
  }

  spiralPath(p: number): Vector2D {
    p = this.constrain(1.2 * p, 0, 1);
    p = this.ease(p, 1.8);
    const turns = 6;
    const theta = 2 * Math.PI * turns * Math.sqrt(p);
    const r = 170 * Math.sqrt(p);
    return new Vector2D(
      r * Math.cos(theta),
      r * Math.sin(theta) + this.startDotYOffset
    );
  }

  showProjectedDot(pos: Vector3D, sizeFactor: number) {
    const t2 = this.constrain(
      this.map(this.time, this.changeEventTime, 1, 0, 1),
      0,
      1
    );
    const camZ =
      this.cameraZ +
      this.ease(Math.pow(t2, 1.2), 1.8) * this.cameraTravelDistance;
    if (pos.z <= camZ) return;
    const depth = pos.z - camZ;
    const x = (this.viewZoom * pos.x) / depth;
    const y = (this.viewZoom * pos.y) / depth;
    const sw = (400 * sizeFactor) / depth;
    this.ctx.lineWidth = sw;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 0.5, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawStartDot() {
    if (this.time <= this.changeEventTime) return;
    const dy = (this.cameraZ * this.startDotYOffset) / this.viewZoom;
    this.showProjectedDot(new Vector3D(0, dy, this.cameraTravelDistance), 2.5);
  }

  private drawTrail(t1: number) {
    for (let i = 0; i < this.trailLength; i++) {
      const f = this.map(i, 0, this.trailLength, 1.1, 0.1);
      const sw = (1.3 * (1 - t1) + 3.0 * Math.sin(Math.PI * t1)) * f;
      this.ctx.fillStyle = "white";
      this.ctx.lineWidth = sw;
      const pos = this.spiralPath(t1 - 0.00015 * i);
      const off = new Vector2D(pos.x + 5, pos.y + 5);
      const mid = new Vector2D((pos.x + off.x) / 2, (pos.y + off.y) / 2);
      const dx = pos.x - mid.x,
        dy = pos.y - mid.y;
      const angle = Math.atan2(dy, dx);
      const r = Math.sqrt(dx * dx + dy * dy);
      const o = i % 2 === 0 ? -1 : 1;
      const ep = this.easeOutElastic(
        Math.sin(this.time * Math.PI * 2) * 0.5 + 0.5
      );
      const rx = mid.x + r * Math.cos(angle + o * Math.PI * ep);
      const ry = mid.y + r * Math.sin(angle + o * Math.PI * ep);
      this.ctx.beginPath();
      this.ctx.arc(rx, ry, sw / 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.size, this.size);
    ctx.save();
    ctx.translate(this.size / 2, this.size / 2);
    const t1 = this.constrain(
      this.map(this.time, 0, this.changeEventTime + 0.25, 0, 1),
      0,
      1
    );
    const t2 = this.constrain(
      this.map(this.time, this.changeEventTime, 1, 0, 1),
      0,
      1
    );
    ctx.rotate(-Math.PI * this.ease(t2, 2.7));
    this.drawTrail(t1);
    ctx.fillStyle = "white";
    for (const star of this.stars) star.render(t1, this);
    this.drawStartDot();
    ctx.restore();
  }

  destroy() {
    this.timeline.kill();
  }
}

/* ─── React component ────────────────────────────────────────────────────── */
export function SpiralAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctrlRef = useRef<AnimationController | null>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: Math.ceil(width), h: Math.ceil(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!dims.w || !dims.h) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctrlRef.current?.destroy();

    const dpr = window.devicePixelRatio || 1;
    const size = Math.max(dims.w, dims.h);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${dims.w}px`;
    canvas.style.height = `${dims.h}px`;
    ctx.scale(dpr, dpr);

    ctrlRef.current = new AnimationController(canvas, ctx, size);
    return () => {
      ctrlRef.current?.destroy();
      ctrlRef.current = null;
    };
  }, [dims]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-black"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
