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
        { opacity: 0, scaleX: 0, scaleY: 0 },
        {
          opacity: 1,
          scaleX: 1,
          scaleY: 1,
          duration: 1.2,
          stagger: 0.02,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 80%",
          },
          transformOrigin: "center center",
        }
      );
    });
  }, []);

  const cols = 22;
  const rows = 14;
  const dots: { x: number; y: number; big: boolean }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const big = (r + c) % 5 === 0 && (r * c) % 7 === 0;
      dots.push({ x: c, y: r, big });
    }
  }

  return (
    <div
      ref={rootRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {dots.map((d, i) => (
        <div
          key={i}
          data-line
          className="m-auto"
          style={{
            width: d.big ? 4 : 2,
            height: d.big ? 4 : 2,
            borderRadius: 1,
            background: d.big
              ? "rgba(245,255,0,0.55)"
              : "rgba(138,138,154,0.25)",
            boxShadow: d.big ? "0 0 6px rgba(245,255,0,0.5)" : "none",
          }}
        />
      ))}
    </div>
  );
}
