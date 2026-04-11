"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

interface ShaderProps {
  source: string;
  uniforms: Uniforms;
  maxFps?: number;
}

interface SignInPageProps {
  className?: string;
}

export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  reverse?: boolean;
}) => {
  return (
    <div className={cn("relative h-full w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          shader={`
            ${reverse ? "u_reverse_active" : "false"}_;
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      )}
    </div>
  );
};

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}) => {
  const uniforms = React.useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: "uniform3fv",
      },
      u_opacities: { value: opacities, type: "uniform1fv" },
      u_total_size: { value: totalSize, type: "uniform1f" },
      u_dot_size: { value: dotSize, type: "uniform1f" },
      u_reverse: {
        value: shader.includes("u_reverse_active") ? 1 : 0,
        type: "uniform1i",
      },
    };
  }, [colors, opacities, totalSize, dotSize, shader]);

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;
        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse;
        out vec4 fragColor;
        float PHI = 1.61803398874989484820459;
        float random(vec2 xy){
          return fract(tan(distance(xy*PHI,xy)*0.5)*xy.x);
        }
        void main(){
          vec2 st = fragCoord.xy;
          ${center.includes("x") ? "st.x -= abs(floor((mod(u_resolution.x,u_total_size)-u_dot_size)*0.5));" : ""}
          ${center.includes("y") ? "st.y -= abs(floor((mod(u_resolution.y,u_total_size)-u_dot_size)*0.5));" : ""}
          float opacity = step(0.0,st.x)*step(0.0,st.y);
          vec2 st2 = vec2(int(st.x/u_total_size),int(st.y/u_total_size));
          float show_offset = random(st2);
          float rand = random(st2*floor((u_time/5.0)+show_offset+5.0));
          opacity *= u_opacities[int(rand*10.0)];
          opacity *= 1.0-step(u_dot_size/u_total_size,fract(st.x/u_total_size));
          opacity *= 1.0-step(u_dot_size/u_total_size,fract(st.y/u_total_size));
          vec3 color = u_colors[int(show_offset*6.0)];
          float animation_speed_factor = 0.5;
          vec2 center_grid = u_resolution/2.0/u_total_size;
          float dist_from_center = distance(center_grid,st2);
          float max_grid_dist = distance(center_grid,vec2(0.0,0.0));
          float timing_offset_intro = dist_from_center*0.01+(random(st2)*0.15);
          float timing_offset_outro = (max_grid_dist-dist_from_center)*0.02+(random(st2+42.0)*0.2);
          if(u_reverse==1){
            opacity *= 1.0-step(timing_offset_outro,u_time*animation_speed_factor);
            opacity *= clamp((step(timing_offset_outro+0.1,u_time*animation_speed_factor))*1.25,1.0,1.25);
          } else {
            opacity *= step(timing_offset_intro,u_time*animation_speed_factor);
            opacity *= clamp((1.0-step(timing_offset_intro+0.1,u_time*animation_speed_factor))*1.25,1.0,1.25);
          }
          fragColor = vec4(color,opacity);
          fragColor.rgb *= fragColor.a;
        }`}
      uniforms={uniforms}
      maxFps={60}
    />
  );
};

const ShaderMaterial = ({
  source,
  uniforms,
}: {
  source: string;
  uniforms: Uniforms;
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.ShaderMaterial;
    mat.uniforms.u_time.value = clock.getElapsedTime();
  });

  const material = useMemo(() => {
    const prepared: Record<string, THREE.IUniform> = {};
    for (const key in uniforms) {
      const u = uniforms[key];
      if (u.type === "uniform3fv") {
        prepared[key] = {
          value: (u.value as number[][]).map((v) =>
            new THREE.Vector3().fromArray(v)
          ),
        };
      } else {
        prepared[key] = { value: u.value };
      }
    }
    prepared["u_time"] = { value: 0 };
    prepared["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    };
    return new THREE.ShaderMaterial({
      vertexShader: `
        precision mediump float;
        uniform vec2 u_resolution;
        out vec2 fragCoord;
        void main(){
          gl_Position = vec4(position.xy,0.0,1.0);
          fragCoord = (position.xy+vec2(1.0))*0.5*u_resolution;
          fragCoord.y = u_resolution.y-fragCoord.y;
        }`,
      fragmentShader: source,
      uniforms: prepared,
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    });
  }, [size.width, size.height, source]);

  return (
    <mesh ref={ref as React.RefObject<THREE.Mesh>}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<ShaderProps> = ({ source, uniforms }) => (
  <Canvas className="absolute inset-0 h-full w-full">
    <ShaderMaterial source={source} uniforms={uniforms} />
  </Canvas>
);

const AnimatedNavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    className="group relative inline-flex h-5 items-center overflow-hidden text-sm"
  >
    <div className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
      <span className="text-gray-300">{children}</span>
      <span className="text-white">{children}</span>
    </div>
  </a>
);

function MiniNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [shape, setShape] = useState("rounded-full");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isOpen) {
      setShape("rounded-xl");
    } else {
      timerRef.current = setTimeout(() => setShape("rounded-full"), 300);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen]);

  const navLinks = [
    { label: "Manifesto", href: "#1" },
    { label: "Careers", href: "#2" },
    { label: "Discover", href: "#3" },
  ];

  return (
    <header
      className={`fixed top-6 left-1/2 z-20 flex w-[calc(100%-2rem)] -translate-x-1/2 flex-col items-center border border-[#333] bg-[#1f1f1f57] px-6 py-3 backdrop-blur-sm sm:w-auto ${shape} transition-[border-radius] duration-300`}
    >
      <div className="flex w-full items-center justify-between gap-x-8">
        <div className="relative flex h-5 w-5 items-center justify-center">
          {[
            ["top-0 left-1/2 -translate-x-1/2"],
            ["left-0 top-1/2 -translate-y-1/2"],
            ["right-0 top-1/2 -translate-y-1/2"],
            ["bottom-0 left-1/2 -translate-x-1/2"],
          ].map((cls, i) => (
            <span
              key={i}
              className={`absolute h-1.5 w-1.5 rounded-full bg-gray-200 opacity-80 ${cls}`}
            />
          ))}
        </div>
        <nav className="hidden items-center space-x-6 text-sm sm:flex">
          {navLinks.map((l) => (
            <AnimatedNavLink key={l.href} href={l.href}>
              {l.label}
            </AnimatedNavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <button className="rounded-full border border-[#333] bg-[rgba(31,31,31,0.62)] px-4 py-2 text-sm text-gray-300 transition-colors hover:border-white/50 hover:text-white">
            LogIn
          </button>
          <button className="rounded-full bg-gradient-to-br from-gray-100 to-gray-300 px-4 py-2 text-sm font-semibold text-black transition-all hover:from-gray-200 hover:to-gray-400">
            Signup
          </button>
        </div>
        <button
          className="flex h-8 w-8 items-center justify-center text-gray-300 sm:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>
      <div
        className={`flex w-full flex-col items-center overflow-hidden transition-all duration-300 sm:hidden ${isOpen ? "max-h-96 pt-4 opacity-100" : "pointer-events-none max-h-0 pt-0 opacity-0"}`}
      >
        <nav className="flex w-full flex-col items-center space-y-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="w-full text-center text-gray-300 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="mt-4 flex w-full flex-col space-y-4">
          <button className="w-full rounded-full border border-[#333] bg-[rgba(31,31,31,0.62)] px-4 py-2 text-sm text-gray-300">
            LogIn
          </button>
          <button className="w-full rounded-full bg-gradient-to-br from-gray-100 to-gray-300 px-4 py-2 text-sm font-semibold text-black">
            Signup
          </button>
        </div>
      </div>
    </header>
  );
}

export const SignInPage = ({ className }: SignInPageProps) => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setStep("code");
  };

  useEffect(() => {
    if (step === "code")
      setTimeout(() => codeInputRefs.current[0]?.focus(), 500);
  }, [step]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) codeInputRefs.current[index + 1]?.focus();
    if (index === 5 && value && newCode.every((d) => d.length === 1)) {
      setReverseCanvasVisible(true);
      setTimeout(() => setInitialCanvasVisible(false), 50);
      setTimeout(() => setStep("success"), 2000);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0)
      codeInputRefs.current[index - 1]?.focus();
  };

  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col bg-black",
        className
      )}
    >
      <div className="absolute inset-0 z-0">
        {initialCanvasVisible && (
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-black"
            colors={[
              [255, 255, 255],
              [255, 255, 255],
            ]}
            dotSize={6}
            reverse={false}
          />
        )}
        {reverseCanvasVisible && (
          <CanvasRevealEffect
            animationSpeed={4}
            containerClassName="bg-black"
            colors={[
              [255, 255, 255],
              [255, 255, 255],
            ]}
            dotSize={6}
            reverse={true}
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 right-0 left-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <MiniNavbar />
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="mt-[150px] w-full max-w-sm">
            <AnimatePresence mode="wait">
              {step === "email" ? (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-6 text-center"
                >
                  <div>
                    <h1 className="text-[2.5rem] leading-tight font-bold tracking-tight text-white">
                      Welcome Developer
                    </h1>
                    <p className="text-[1.8rem] font-light text-white/70">
                      Your sign in component
                    </p>
                  </div>
                  <div className="space-y-4">
                    <button className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-white backdrop-blur-sm transition-colors hover:bg-white/10">
                      <span className="text-lg">G</span>
                      <span>Sign in with Google</span>
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-sm text-white/40">or</span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>
                    <form onSubmit={handleEmailSubmit}>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="info@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-full border border-white/10 bg-black/30 px-4 py-3 text-center text-white backdrop-blur focus:border-white/30 focus:outline-none"
                          required
                        />
                        <button
                          type="submit"
                          className="absolute top-1.5 right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                        >
                          →
                        </button>
                      </div>
                    </form>
                  </div>
                  <p className="pt-10 text-xs text-white/40">
                    By signing up, you agree to the{" "}
                    <Link href="#" className="underline hover:text-white/60">
                      MSA
                    </Link>
                    ,{" "}
                    <Link href="#" className="underline hover:text-white/60">
                      Product Terms
                    </Link>
                    ,{" "}
                    <Link href="#" className="underline hover:text-white/60">
                      Privacy Notice
                    </Link>
                    .
                  </p>
                </motion.div>
              ) : step === "code" ? (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-6 text-center"
                >
                  <div>
                    <h1 className="text-[2.5rem] leading-tight font-bold tracking-tight text-white">
                      We sent you a code
                    </h1>
                    <p className="text-[1.25rem] font-light text-white/50">
                      Please enter it
                    </p>
                  </div>
                  <div className="relative rounded-full border border-white/10 bg-transparent px-5 py-4">
                    <div className="flex items-center justify-center">
                      {code.map((digit, i) => (
                        <div key={i} className="flex items-center">
                          <div className="relative">
                            <input
                              ref={(el) => {
                                codeInputRefs.current[i] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={1}
                              value={digit}
                              onChange={(e) =>
                                handleCodeChange(i, e.target.value)
                              }
                              onKeyDown={(e) => handleKeyDown(i, e)}
                              className="w-8 appearance-none border-none bg-transparent text-center text-xl text-white focus:ring-0 focus:outline-none"
                              style={{ caretColor: "transparent" }}
                            />
                            {!digit && (
                              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <span className="text-xl text-white">0</span>
                              </div>
                            )}
                          </div>
                          {i < 5 && (
                            <span className="text-xl text-white/20">|</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="cursor-pointer text-sm text-white/50 transition-colors hover:text-white/70">
                    Resend code
                  </p>
                  <div className="flex w-full gap-3">
                    <motion.button
                      onClick={() => {
                        setStep("email");
                        setCode(["", "", "", "", "", ""]);
                        setReverseCanvasVisible(false);
                        setInitialCanvasVisible(true);
                      }}
                      className="w-[30%] rounded-full bg-white px-8 py-3 font-medium text-black transition-colors hover:bg-white/90"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      disabled={!code.every((d) => d !== "")}
                      className={`flex-1 rounded-full border py-3 font-medium transition-all ${code.every((d) => d !== "") ? "border-transparent bg-white text-black hover:bg-white/90" : "cursor-not-allowed border-white/10 bg-[#111] text-white/50"}`}
                    >
                      Continue
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                  className="space-y-6 text-center"
                >
                  <h1 className="text-[2.5rem] leading-tight font-bold tracking-tight text-white">
                    You're in!
                  </h1>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="py-10"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-white to-white/70">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-black"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </motion.div>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="w-full rounded-full bg-white py-3 font-medium text-black transition-colors hover:bg-white/90"
                  >
                    Continue to Dashboard
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
