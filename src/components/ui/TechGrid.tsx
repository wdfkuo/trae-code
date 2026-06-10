import { useEffect, useRef } from "react";

interface TechGridProps {
  className?: string;
}

export default function TechGrid({ className = "" }: TechGridProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    import("gsap").then(({ gsap }) => {
      if (!rootRef.current) return;
      const items =
        rootRef.current.querySelectorAll<HTMLElement>("[data-line]");
      gsap.fromTo(
        items,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          stagger: 0.01,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 80%",
          },
        }
      );
    });
  }, []);

  // 生成网格线
  const gridLines = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div
      ref={rootRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 横向网格线 */}
      <svg className="absolute inset-0 h-full w-full opacity-20">
        <defs>
          <linearGradient id="gridFadeTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0a0f" stopOpacity="1" />
            <stop offset="50%" stopColor="#0a0a0f" stopOpacity="0" />
            <stop offset="100%" stopColor="#0a0a0f" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gridFadeBottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0a0f" stopOpacity="0" />
            <stop offset="50%" stopColor="#0a0a0f" stopOpacity="0" />
            <stop offset="100%" stopColor="#0a0a0f" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* 横向线 */}
        {gridLines.map((_, i) => (
          <line
            key={`h-${i}`}
            data-line
            x1="0"
            y1={`${(i + 1) * 5}%`}
            x2="100%"
            y2={`${(i + 1) * 5}%`}
            stroke="#2a2a3a"
            strokeWidth="0.5"
            strokeDasharray="4 8"
          />
        ))}

        {/* 纵向线 */}
        {gridLines.map((_, i) => (
          <line
            key={`v-${i}`}
            data-line
            x1={`${(i + 1) * 5}%`}
            y1="0"
            x2={`${(i + 1) * 5}%`}
            y2="100%"
            stroke="#2a2a3a"
            strokeWidth="0.5"
            strokeDasharray="4 8"
          />
        ))}

        {/* 中心十字高亮 */}
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#F5FF00" strokeWidth="0.5" strokeOpacity="0.15" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#F5FF00" strokeWidth="0.5" strokeOpacity="0.15" />

        {/* 渐变遮罩 */}
        <rect x="0" y="0" width="100%" height="15%" fill="url(#gridFadeTop)" />
        <rect x="0" y="85%" width="100%" height="15%" fill="url(#gridFadeBottom)" />
      </svg>

      {/* 动态扫描线 */}
      <div
        data-line
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent"
        style={{
          animation: 'scanDown 8s linear infinite',
        }}
      />
      <div
        data-line
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-yellow/20 to-transparent"
        style={{
          animation: 'scanUp 12s linear infinite reverse',
        }}
      />

      <style>{`
        @keyframes scanDown {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes scanUp {
          0% { top: 100%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 0%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
