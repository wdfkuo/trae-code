import { useEffect, useRef } from "react";

interface HexRadarProps {
  stats: { label: string; value: number }[]; // 6 项, value 0-1
  accent?: string;
  size?: number;
  className?: string;
}

/**
 * 六边形能力雷达图（SVG 自绘 + GSAP 弹性动画）
 */
export default function HexRadar({
  stats,
  accent = "#F5FF00",
  size = 280,
  className = "",
}: HexRadarProps) {
  const polyRef = useRef<SVGPolygonElement | null>(null);
  const dotRefs = useRef<(SVGElement | null)[]>([]);

  useEffect(() => {
    // 懒加载 gsap — 组件挂载时已全局可用
    import("gsap").then(({ gsap }) => {
      const pts = computePoints(stats, size);
      if (polyRef.current) {
        gsap.fromTo(
          polyRef.current,
          { attr: { points: emptyPoints(size) } },
          {
            attr: { points: pts.map((p) => p.join(",")).join(" ") },
            duration: 1.6,
            ease: "elastic.out(1, 0.6)",
            scrollTrigger: {
              trigger: polyRef.current,
              start: "top 85%",
            },
          }
        );
      }
      dotRefs.current.forEach((d, i) => {
        if (!d) return;
        gsap.fromTo(
          d,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            delay: 0.3 + i * 0.08,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: d,
              start: "top 85%",
            },
            transformOrigin: "center center",
          }
        );
      });
    });
  }, [stats, size]);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 24;

  const rings = [0.3, 0.55, 0.8, 1];
  const hexVertices = (r: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    });

  const axes = hexVertices(radius);
  const axisLabels = ["攻击", "生存", "机动", "控制", "辅助", "爆发"];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-label="character-ability-radar"
    >
      {/* 网格环 */}
      {rings.map((ratio, i) => {
        const pts = hexVertices(radius * ratio)
          .map((p) => p.join(","))
          .join(" ");
        return (
          <polygon
            key={i}
            className="hex-line"
            points={pts}
            fill="none"
            strokeDasharray={i === rings.length - 1 ? "0" : "3 4"}
          />
        );
      })}

      {/* 轴线 */}
      {axes.map((p, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={p[0]}
          y2={p[1]}
          className="hex-line"
        />
      ))}

      {/* 数据多边形 */}
      <polygon
        ref={polyRef}
        points={emptyPoints(size).map((p) => p.join(",")).join(" ")}
        fill={`${accent}22`}
        stroke={accent}
        strokeWidth={1.5}
        style={{ filter: `drop-shadow(0 0 12px ${accent}88)` }}
      />

      {/* 数据点 */}
      {axes.map((p, i) => {
        const v = stats[i]?.value ?? 0;
        const x = cx + (p[0] - cx) * v;
        const y = cy + (p[1] - cy) * v;
        return (
          <circle
            key={i}
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            cx={x}
            cy={y}
            r={3.5}
            fill={accent}
          />
        );
      })}

      {/* 标签 */}
      {axes.map((p, i) => {
        const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const lx = cx + Math.cos(a) * (radius + 18);
        const ly = cy + Math.sin(a) * (radius + 18);
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fill="#8a8a9a"
            fontFamily="JetBrains Mono, monospace"
            style={{ letterSpacing: "0.2em" }}
          >
            {axisLabels[i]}
          </text>
        );
      })}
    </svg>
  );
}

function emptyPoints(size: number) {
  const cx = size / 2;
  const cy = size / 2;
  return Array.from({ length: 6 }, () => [cx, cy]);
}

function computePoints(
  stats: { label: string; value: number }[],
  size: number
) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 24;
  return stats.slice(0, 6).map((s, i) => {
    const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const r = radius * Math.max(0, Math.min(1, s.value));
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
}
