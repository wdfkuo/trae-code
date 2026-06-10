import { useEffect, useRef } from "react";

interface RadarScanProps {
  size?: number;
  className?: string;
  accent?: string;
}

/**
 * 雷达扫描动画 - SVG 自绘，扫描线 0->360° 旋转
 * 当滚动进入视口时触发解码动画
 */
export default function RadarScan({
  size = 360,
  className = "",
  accent = "#00E5FF",
}: RadarScanProps) {
  const sweepRef = useRef<SVGGElement | null>(null);
  const dotsRef = useRef<SVGGElement | null>(null);
  const progressRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    import("gsap").then(({ gsap }) => {
      if (sweepRef.current) {
        gsap.to(sweepRef.current, {
          rotation: 360,
          duration: 6,
          repeat: -1,
          ease: "none",
          transformOrigin: "center center",
        });
      }
      if (dotsRef.current) {
        const dots = dotsRef.current.querySelectorAll("circle");
        dots.forEach((d, i) => {
          gsap.fromTo(
            d,
            { opacity: 0, scale: 0 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.6 + (i % 3) * 0.2,
              delay: i * 0.12,
              repeat: -1,
              repeatDelay: 2 + (i % 4) * 0.6,
              yoyo: true,
              ease: "power2.inOut",
              transformOrigin: "center center",
            }
          );
        });
      }
      if (progressRef.current) {
        const total = progressRef.current.getTotalLength();
        gsap.fromTo(
          progressRef.current,
          { strokeDashoffset: total, strokeDasharray: total },
          {
            strokeDashoffset: 0,
            duration: 4,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: progressRef.current,
              start: "top 80%",
            },
          }
        );
      }
    });
  }, []);

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;

  const rings = [0.3, 0.55, 0.8, 1];
  // Signal dots (fake targets)
  const targets = [
    { x: cx + r * 0.45, y: cy - r * 0.32, s: 2.5 },
    { x: cx - r * 0.55, y: cy + r * 0.18, s: 3 },
    { x: cx + r * 0.22, y: cy + r * 0.62, s: 2 },
    { x: cx - r * 0.08, y: cy - r * 0.55, s: 2.2 },
    { x: cx + r * 0.68, y: cy + r * 0.2, s: 2.8 },
    { x: cx - r * 0.35, y: cy - r * 0.1, s: 2 },
  ];

  // conic gradient via SVG radial gradiant + mask
  const gradId = `sweep-grad-${accent.replace("#", "")}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-label="radar-scan"
    >
      <defs>
        <radialGradient id={gradId}>
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="60%" stopColor={accent} stopOpacity="0.05" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`cross-${accent}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Outer circle */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={`url(#${gradId})`}
        stroke={accent}
        strokeOpacity="0.3"
        strokeWidth="1"
      />

      {/* Rings */}
      {rings.map((ratio, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r * ratio}
          fill="none"
          stroke={accent}
          strokeOpacity={0.1 + i * 0.08}
          strokeWidth="1"
          strokeDasharray={ratio === 1 ? "0" : "4 6"}
        />
      ))}

      {/* Crosshair */}
      <line
        x1={cx - r}
        y1={cy}
        x2={cx + r}
        y2={cy}
        stroke={accent}
        strokeOpacity="0.25"
      />
      <line
        x1={cx}
        y1={cy - r}
        x2={cx}
        y2={cy + r}
        stroke={accent}
        strokeOpacity="0.25"
      />

      {/* Sweep */}
      <g ref={sweepRef}>
        <path
          d={`M ${cx} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 0 0 ${
            cx + r * Math.cos(-Math.PI / 3)
          } ${cy + r * Math.sin(-Math.PI / 3)} Z`}
          fill={accent}
          fillOpacity="0.14"
        />
        <line
          x1={cx}
          y1={cy}
          x2={cx + r}
          y2={cy}
          stroke={accent}
          strokeWidth="1.5"
          style={{ filter: `drop-shadow(0 0 6px ${accent})` }}
        />
      </g>

      {/* Signal dots */}
      <g ref={dotsRef}>
        {targets.map((t, i) => (
          <circle
            key={i}
            cx={t.x}
            cy={t.y}
            r={t.s}
            fill={accent}
            style={{ filter: `drop-shadow(0 0 6px ${accent})` }}
          />
        ))}
      </g>

      {/* Center */}
      <circle cx={cx} cy={cy} r={3} fill={accent} />

      {/* Circular progress stroke */}
      <circle
        ref={progressRef as unknown as React.RefObject<SVGCircleElement>}
        cx={cx}
        cy={cy}
        r={r + 6}
        fill="none"
        stroke={accent}
        strokeOpacity="0.8"
        strokeWidth="1"
        style={{ filter: `drop-shadow(0 0 4px ${accent}99)` }}
      />
    </svg>
  );
}
