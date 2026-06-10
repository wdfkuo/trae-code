import { useEffect, useRef } from "react";
import RadarScan from "../ui/RadarScan";

const TERRAIN_DOTS = 260;

export default function WorldviewSection() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotsProgress = useRef({ value: 0 });
  const rafRef = useRef(0);

  useEffect(() => {
    import("gsap").then(({ gsap }) => {
      const headings = rootRef.current?.querySelectorAll<HTMLElement>(
        "[data-heading]"
      );
      const lines = rootRef.current?.querySelectorAll<HTMLElement>("[data-line]");

      if (headings) {
        gsap.fromTo(
          headings,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 75%",
            },
          }
        );
      }
      if (lines) {
        gsap.fromTo(
          lines,
          { opacity: 0, clipPath: "inset(0 100% 0 0)" },
          {
            opacity: 1,
            clipPath: "inset(0 0 0 0)",
            duration: 1.4,
            stagger: 0.08,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 75%",
            },
          }
        );
      }

      gsap.to(dotsProgress.current, {
        value: 1,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          end: "bottom top",
          scrub: 0.7,
        },
      });
    });
  }, []);

  // Draw terrain dots from scattered -> clustered (outline of the map)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate scatter positions and target positions (an outline of a shape)
    const width = () => (canvas.parentElement?.clientWidth ?? 0);
    const height = () => (canvas.parentElement?.clientHeight ?? 0);

    const targetPoints = generateMapOutline(TERRAIN_DOTS);
    const scatter = Array.from({ length: TERRAIN_DOTS }, () => ({
      x: Math.random(),
      y: Math.random(),
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      const w = width();
      const h = height();
      ctx.clearRect(0, 0, w, h);
      const p = Math.max(0, Math.min(1, dotsProgress.current.value));
      // ease-in-out-ish
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      for (let i = 0; i < TERRAIN_DOTS; i++) {
        const s = scatter[i];
        const t = targetPoints[i];
        // drift scatter position slightly for life
        const driftX = Math.sin(performance.now() * 0.0006 + s.phase) * 0.01;
        const driftY =
          Math.cos(performance.now() * 0.0007 + s.phase * 1.3) * 0.01;

        const sx = s.x + driftX;
        const sy = s.y + driftY;

        const x = (sx + (t.x - sx) * eased) * w;
        const y = (sy + (t.y - sy) * eased) * h;

        // brightness rises as dots converge
        const alpha = 0.15 + 0.85 * eased;
        const isEdge = t.e;
        ctx.beginPath();
        ctx.arc(x, y, isEdge ? 1.5 : 1, 0, Math.PI * 2);
        ctx.fillStyle = isEdge
          ? `rgba(0, 229, 255, ${alpha})`
          : `rgba(245, 255, 0, ${alpha * 0.7})`;
        ctx.shadowBlur = isEdge ? 6 : 3;
        ctx.shadowColor = isEdge ? "rgba(0,229,255,0.6)" : "rgba(245,255,0,0.2)";
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[110svh] w-full items-center overflow-hidden bg-ink-950 py-24"
      id="worldview"
    >
      <div className="noise opacity-40" />

      <div className="container relative z-10 grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <span className="label-chip" data-heading>
            02 · worldview
          </span>
          <h2
            data-heading
            className="mt-6 font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.05] text-ink-50"
          >
            <span className="text-ink-300">扇区-7 地形</span>
            <br />
            解码中…
          </h2>

          <p
            data-heading
            className="mt-6 max-w-md text-[15px] leading-7 text-ink-400"
          >
            信号沿纬度 31.23 收敛。我们正在接收一段遥远终端的地理回波 —
            这不是地图，是<span className="text-neon-yellow">记忆碎片的投影</span>。
            点阵从无序到聚集，地形在你的滚动里显形。
          </p>

          <div className="mt-10 grid max-w-md gap-5 font-mono text-[11px] uppercase tracking-[0.3em]">
            {[
              { k: "packet-drop", v: "0.04%", color: "text-neon-yellow" },
              { k: "decode-depth", v: "layer-03 / 08", color: "text-neon-cyan" },
              { k: "origin-fragment", v: "city-formerly-known-as-海", color: "text-ink-300" },
            ].map((item, i) => (
              <div
                data-line
                key={i}
                className="flex items-center justify-between border-b border-ink-700/60 pb-2"
              >
                <span className="text-ink-500">{item.k}</span>
                <span className={item.color}>{item.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative md:col-span-7">
          <div className="relative flex aspect-[4/3] w-full items-center justify-center">
            {/* Radar */}
            <div className="absolute right-0 top-0 h-[62%] w-[62%] opacity-80 md:h-[70%] md:w-[70%]">
              <RadarScan size={360} accent="#00E5FF" className="h-full w-full" />
            </div>

            {/* Canvas terrain */}
            <div className="absolute inset-0">
              <canvas ref={canvasRef} className="h-full w-full" />
            </div>

            {/* Overlay grid frame */}
            <div className="pointer-events-none absolute inset-0 border border-ink-700/40">
              <div className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-neon-yellow/60" />
              <div className="absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2 border-neon-yellow/60" />
              <div className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-neon-yellow/60" />
              <div className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-neon-yellow/60" />
            </div>

            {/* Corner HUD */}
            <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.35em] text-ink-500">
              terrain · recon · pass-02
            </div>
            <div className="pointer-events-none absolute right-4 top-4 font-mono text-[10px] uppercase tracking-[0.35em] text-neon-cyan/80">
              radar · live
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 生成地图轮廓 + 内部散点 —— 在 0..1 坐标系下绘制一个抽象 "破碎城市" 轮廓
 */
function generateMapOutline(n: number) {
  const points: { x: number; y: number; e: boolean }[] = [];

  // 轮廓：两段弧 + 一段直线，模拟海岸线 / 城市边界
  const outline = (t: number) => {
    // Parametric curve drawn in 0..1
    const a = Math.sin(t * Math.PI) * 0.5;
    const x = 0.15 + t * 0.7 + Math.sin(t * 12) * 0.02;
    const y = 0.7 - a * 0.35 + Math.sin(t * 7 + 1.3) * 0.04;
    return { x, y, e: true };
  };

  const outline2 = (t: number) => {
    const x = 0.25 + t * 0.55 + Math.cos(t * 9) * 0.015;
    const y = 0.3 + Math.sin(t * Math.PI) * 0.18 + Math.cos(t * 11) * 0.02;
    return { x, y, e: true };
  };

  const outlineN = Math.floor(n * 0.35);
  const outline2N = Math.floor(n * 0.15);
  for (let i = 0; i < outlineN; i++) points.push(outline(i / outlineN));
  for (let i = 0; i < outline2N; i++) points.push(outline2(i / outline2N));

  // 内部点：一个椭圆区域
  const innerN = n - points.length;
  for (let i = 0; i < innerN; i++) {
    const r = Math.sqrt(Math.random()) * 0.25;
    const a = Math.random() * Math.PI * 2;
    const x = 0.5 + Math.cos(a) * r * 1.6;
    const y = 0.55 + Math.sin(a) * r * 0.9;
    points.push({ x, y, e: false });
  }

  // Deterministic-ish shuffle
  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor((i * 9301 + 49297) % (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
  }
  return points;
}
