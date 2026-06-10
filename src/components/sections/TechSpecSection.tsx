import { useEffect, useRef } from "react";
import TechGrid from "../ui/TechGrid";

interface Spec {
  key: string;
  value: string;
  sub: string;
}

const SPECS: Spec[] = [
  { key: "engine", value: "ENDER · v0.2", sub: "scrub-based reactive runtime" },
  { key: "renderer", value: "WebGL 2.0 / Canvas", sub: "8k particles · 60fps target" },
  { key: "anim", value: "GSAP 3.12", sub: "ScrollTrigger · Lenis smooth" },
  { key: "stack", value: "React 18 + TS + Vite", sub: "zero-runtime styling (Tailwind)" },
  { key: "motion", value: "ease-out / elastic", sub: "long-tail 1.4s+ transitions" },
  { key: "responsive", value: "3 breakpoints", sub: "mobile / tablet / desktop" },
];

export default function TechSpecSection() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cubeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    import("gsap").then(({ gsap }) => {
      const cards = rootRef.current?.querySelectorAll<HTMLElement>("[data-card]");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 70%",
            },
          }
        );
      }

      const headings = rootRef.current?.querySelectorAll<HTMLElement>(
        "[data-heading]"
      );
      if (headings) {
        gsap.fromTo(
          headings,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Cube spin (scroll-driven)
      if (cubeRef.current) {
        gsap.to(cubeRef.current, {
          rotationX: 360,
          rotationY: 360,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
          transformOrigin: "center center",
        });
      }
    });
  }, []);

  return (
    <section
      id="techspec"
      ref={rootRef}
      className="relative min-h-[110svh] w-full overflow-hidden bg-ink-950 py-24"
    >
      <TechGrid />
      <div className="noise opacity-30" />

      <div className="container relative z-10">
        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="label-chip" data-heading>
              05 · architecture
            </span>
            <h2
              data-heading
              className="mt-6 font-display text-[clamp(1.8rem,4.5vw,3.6rem)] font-bold leading-[1.05] text-ink-50"
            >
              系统架构 <span className="text-ink-400">· 关于这个滚动</span>
            </h2>
            <p
              data-heading
              className="mt-6 max-w-md text-[15px] leading-7 text-ink-400"
            >
              整页由一个 Lenis 滚动实例驱动。每一个区块的 ScrollTrigger
              都挂在同一条时间轴上 —— 你向上、向下滚动时，动画都会被完全
              <span className="text-neon-yellow">双向回放</span>。
            </p>

            <div className="mt-10 grid max-w-md gap-3 font-mono text-[11px] uppercase tracking-[0.3em]">
              {[
                { k: "scroll-frame", v: "Lenis" },
                { k: "animation", v: "GSAP 3.12.5" },
                { k: "particles", v: "Three.js 0.160" },
                { k: "fonts", v: "Orbitron / Inter / JetBrains Mono" },
              ].map((row, i) => (
                <div
                  data-heading
                  key={i}
                  className="flex items-center justify-between border-b border-ink-700/60 pb-2 text-ink-400"
                >
                  <span>{row.k}</span>
                  <span className="text-neon-cyan">{row.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spec cards */}
          <div className="md:col-span-7">
            <div className="grid gap-4 md:grid-cols-2">
              {SPECS.map((s, i) => (
                <div
                  key={s.key}
                  data-card
                  className="group relative overflow-hidden rounded-sm border border-ink-700/60 bg-ink-900/60 p-5"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-ink-500">
                      {String(i + 1).padStart(2, "0")} · {s.key}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-neon-yellow shadow-[0_0_8px_rgba(245,255,0,0.7)]" />
                  </div>
                  <div className="mt-4 font-display text-xl font-semibold text-ink-50 md:text-2xl">
                    {s.value}
                  </div>
                  <div className="mt-2 text-xs leading-6 text-ink-400">{s.sub}</div>
                  <div className="mt-5 h-[2px] w-12 bg-neon-yellow/40 transition-all duration-700 group-hover:w-24 group-hover:bg-neon-yellow" />
                </div>
              ))}
            </div>

            {/* Cube */}
            <div className="relative mt-10 h-52 overflow-hidden rounded-sm border border-ink-700/60 bg-ink-900/40">
              <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "900px" }}>
                <div
                  ref={cubeRef}
                  className="relative h-28 w-28"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {[
                    { t: "translateZ(56px)", c: "#F5FF00" },
                    { t: "rotateY(180deg) translateZ(56px)", c: "#00E5FF" },
                    { t: "rotateY(90deg) translateZ(56px)", c: "#FF3EA5" },
                    { t: "rotateY(-90deg) translateZ(56px)", c: "#F5FF00" },
                    { t: "rotateX(90deg) translateZ(56px)", c: "#00E5FF" },
                    { t: "rotateX(-90deg) translateZ(56px)", c: "#FF3EA5" },
                  ].map((face, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 border"
                      style={{
                        transform: face.t,
                        borderColor: `${face.c}55`,
                        background: `linear-gradient(135deg, ${face.c}18, ${face.c}00)`,
                        boxShadow: `inset 0 0 24px ${face.c}22`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.35em] text-ink-500">
                3d · cube · scroll-spin
              </div>
              <div className="pointer-events-none absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-[0.35em] text-neon-yellow">
                scroll-driven
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
