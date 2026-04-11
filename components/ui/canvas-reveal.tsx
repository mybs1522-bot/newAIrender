"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";

type Uniforms = {
  [key: string]: { value: number[] | number[][] | number; type: string };
};

/* ── ShaderMaterial (Three.js mesh) ───────────────────────────────────────── */
const ShaderMesh = ({
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
    const prepared: Record<string, unknown> = {};
    for (const key in uniforms) {
      const u = uniforms[key];
      switch (u.type) {
        case "uniform1f":
          prepared[key] = { value: u.value };
          break;
        case "uniform1i":
          prepared[key] = { value: u.value };
          break;
        case "uniform1fv":
          prepared[key] = { value: u.value };
          break;
        case "uniform3fv":
          prepared[key] = {
            value: (u.value as number[][]).map((v) =>
              new THREE.Vector3().fromArray(v)
            ),
          };
          break;
        default:
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
          gl_Position = vec4(position.xy, 0.0, 1.0);
          fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
          fragCoord.y = u_resolution.y - fragCoord.y;
        }
      `,
      fragmentShader: source,
      uniforms: prepared as Record<string, THREE.IUniform>,
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

/* ── DotMatrix ────────────────────────────────────────────────────────────── */
const DotMatrix = ({
  colors = [[255, 255, 255]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 3,
  reverse = false,
  animationSpeed = 3,
}: {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  reverse?: boolean;
  animationSpeed?: number;
}) => {
  const uniforms = useMemo(() => {
    let cols = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2)
      cols = [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1]];
    else if (colors.length === 3)
      cols = [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]];
    return {
      u_colors: {
        value: cols.map((c) => [c[0] / 255, c[1] / 255, c[2] / 255]),
        type: "uniform3fv",
      },
      u_opacities: { value: opacities, type: "uniform1fv" },
      u_total_size: { value: totalSize, type: "uniform1f" },
      u_dot_size: { value: dotSize, type: "uniform1f" },
      u_reverse: { value: reverse ? 1 : 0, type: "uniform1i" },
      u_speed: { value: animationSpeed, type: "uniform1f" },
    };
  }, [colors, opacities, totalSize, dotSize, reverse, animationSpeed]);

  return (
    <Canvas className="absolute inset-0 h-full w-full">
      <ShaderMesh
        uniforms={uniforms}
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
          uniform float u_speed;
          out vec4 fragColor;

          float PHI = 1.61803398874989484820459;
          float random(vec2 xy){
            return fract(tan(distance(xy*PHI,xy)*0.5)*xy.x);
          }
          void main(){
            vec2 st = fragCoord.xy;
            st.x -= abs(floor((mod(u_resolution.x,u_total_size)-u_dot_size)*0.5));
            st.y -= abs(floor((mod(u_resolution.y,u_total_size)-u_dot_size)*0.5));
            float opacity = step(0.0,st.x)*step(0.0,st.y);
            vec2 st2 = vec2(int(st.x/u_total_size),int(st.y/u_total_size));
            float show_offset = random(st2);
            float rand = random(st2*floor((u_time/5.0)+show_offset+5.0));
            opacity *= u_opacities[int(rand*10.0)];
            opacity *= 1.0-step(u_dot_size/u_total_size,fract(st.x/u_total_size));
            opacity *= 1.0-step(u_dot_size/u_total_size,fract(st.y/u_total_size));
            vec3 color = u_colors[int(show_offset*6.0)];
            float spd = u_speed * 0.15;
            vec2 cg = u_resolution/2.0/u_total_size;
            float dist = distance(cg,st2);
            float max_dist = distance(cg,vec2(0.0));
            float offset;
            if(u_reverse==1){
              offset = (max_dist-dist)*0.02+random(st2+42.0)*0.2;
              opacity *= 1.0-step(offset,u_time*spd);
            } else {
              offset = dist*0.01+random(st2)*0.15;
              opacity *= step(offset,u_time*spd);
            }
            fragColor = vec4(color,opacity);
            fragColor.rgb *= fragColor.a;
          }
        `}
      />
    </Canvas>
  );
};

/* ── Public export ────────────────────────────────────────────────────────── */
export function CanvasRevealEffect({
  animationSpeed = 3,
  colors = [[255, 255, 255]],
  opacities,
  dotSize = 3,
  containerClassName,
  showGradient = true,
  reverse = false,
}: {
  animationSpeed?: number;
  colors?: number[][];
  opacities?: number[];
  dotSize?: number;
  containerClassName?: string;
  showGradient?: boolean;
  reverse?: boolean;
}) {
  return (
    <div className={cn("relative h-full w-full", containerClassName)}>
      <DotMatrix
        colors={colors}
        dotSize={dotSize}
        opacities={
          opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
        }
        reverse={reverse}
        animationSpeed={animationSpeed}
      />
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      )}
    </div>
  );
}
