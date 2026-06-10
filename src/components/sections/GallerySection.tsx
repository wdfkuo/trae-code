import { useEffect, useRef } from "react";

interface Memory {
  id: string;
  title: string;
  tagline: string;
  timestamp: string;
  accent: string;
  type: string;
}

const MEMORIES: Memory[] = [
  {
    id: "m0",
    title: "记忆回廊 · 00",
    tagline: "第一次听见电流穿过光缆的声音",
    timestamp: "frame-0001 / 24fps",
    accent: "#F5FF00",
    type: "audio",
  },
  {
    id: "m1",
    title: "记忆回廊 · 01",
    tagline: "海岸线在雾里显形 —— 一座曾经叫海的城市",
    timestamp: "frame-0142 / 24fps",
    accent: "#00E5FF",
    type: "visual",
  },
  {
    id: "m2",
    title: "记忆回廊 · 02",
    tagline: "三个干员在十字路口碰面，没有人说话",
    timestamp: "frame-0287 / 24fps",
    accent: "#FF3EA5",
    type: "visual",
  },
  {
    id: "m3",
    title: "记忆回廊 · 03",
    tagline: "信号在这里被切断，数据流化为灰烬",
    timestamp: "frame-0419 / 24fps",
    accent: "#F5FF00",
    type: "data-loss",
  },
  {
    id: "m4",
    title: "记忆回廊 · 04",
    tagline: "一段来自未来的自己发来的加密留言",
    timestamp: "frame-0588 / 24fps",
    accent: "#00E5FF",
    type: "text",
  },
  {
    id: "m5",
    title: "记忆回廊 · 05",
    tagline: "世界线在此分叉 —— 选择进入终端，或回头",
    timestamp: "frame-0724 / 24fps",
    accent: "#FF3EA5",
    type: "branch",
  },
];

export default function GallerySection() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    import("gsap").then(({ gsap }) => {
      const track = trackRef.current;
      if (!track) return;

      // Classic "scroll vertical -> translate horizontal"
      const section = rootRef.current;
      if (!section) return;

      const totalScroll =
        section.scrollHeight - window.innerHeight + window.innerHeight * 0.2;
      // Use GSAP's ScrollTrigger with pinning
      gsap.to(track, {
        x: () => {
          return -(track.scrollWidth - window.innerWidth + 64);
        },
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Subtle hover raise
      const cards = track.querySelectorAll<HTMLElement>("[data-card]");
      cards.forEach((card) => {
        card.style.transition = "transform 0.6s ease, filter 0.6s ease";
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { scale: 1.03, duration: 0.4, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { scale: 1, duration: 0.5, ease: "power3.out" });
        });
      });
    });
  }, []);

  return (
    <section
      id="gallery"
      ref={rootRef}
      className="relative min-h-[220svh] w-full overflow-hidden py-24"
    >
      <div className="noise opacity-30" />

      <div className="container relative z-10">
        <div className="mb-10">
          <span className="label-chip">04 · memory-corridor</span>
          <h2 className="mt-6 font-display text-[clamp(1.8rem,4.5vw,3.6rem)] font-bold leading-[1.05] text-ink-50">
            记忆回廊
            <span className="text-ink-400"> · 继续滚动以推进时间轴</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-ink-400">
            六段记忆，以数据流形式归档于终端。你的滚动将驱动横向时间轴 ——
            每一个帧都会亮起、放大，然后在你离开时虚化。
          </p>
        </div>
      </div>

      <div className="relative h-[100svh] w-full">
        <div
          ref={trackRef}
          className="absolute left-0 top-1/2 flex -translate-y-1/2 gap-8 px-[8vw] will-change-transform"
          style={{ whiteSpace: "nowrap" }}
        >
          {MEMORIES.map((m) => (
            <article
              key={m.id}
              data-card
              className="relative flex h-[65vh] w-[78vw] shrink-0 flex-col justify-between overflow-hidden rounded-sm border border-ink-700/60 bg-ink-900 md:w-[48vw] lg:w-[38vw]"
              style={{
                boxShadow: `0 30px 90px -40px ${m.accent}55`,
              }}
            >
              {/* Generative "image" using SVG + CSS gradients */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${m.accent}16, rgba(10,10,15,0) 55%), radial-gradient(circle at 70% 30%, ${m.accent}18, transparent 60%)`,
                }}
              />
              <svg
                className="absolute inset-0 h-full w-full opacity-60"
                viewBox="0 0 400 600"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id={`gx-${m.id}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={m.accent} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={m.accent} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Abstract silhouette + scanlines */}
                <rect width="400" height="600" fill="transparent" />
                <g opacity="0.6">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={i * 26}
                      x2="400"
                      y2={i * 26}
                      stroke={m.accent}
                      strokeOpacity="0.12"
                    />
                  ))}
                </g>
                {/* Abstract figure */}
                <g fill={`url(#gx-${m.id})`}>
                  <circle cx="200" cy="240" r="70" />
                  <path d="M110,320 Q200,260 290,320 L310,500 Q200,480 90,500 Z" />
                </g>
                <circle
                  cx="200"
                  cy="240"
                  r="70"
                  fill="none"
                  stroke={m.accent}
                  strokeOpacity="0.5"
                />
                <circle
                  cx="200"
                  cy="240"
                  r="120"
                  fill="none"
                  stroke={m.accent}
                  strokeOpacity="0.2"
                  strokeDasharray="3 6"
                />
              </svg>

              {/* Content */}
              <div className="relative flex items-start justify-between p-6">
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.35em]"
                  style={{ color: m.accent }}
                >
                  {m.type}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-ink-500">
                  {m.timestamp}
                </span>
              </div>

              <div className="relative p-6">
                <div className="font-display text-[clamp(1.4rem,2.4vw,2.2rem)] font-bold leading-tight text-ink-50">
                  {m.title}
                </div>
                <p className="mt-3 text-sm leading-7 text-ink-400">
                  {m.tagline}
                </p>
                <div
                  className="mt-5 h-[2px] w-20"
                  style={{
                    background: m.accent,
                    boxShadow: `0 0 10px ${m.accent}`,
                  }}
                />
              </div>
            </article>
          ))}

          {/* End marker */}
          <div className="flex h-[65vh] w-[78vw] shrink-0 items-center justify-center rounded-sm border border-dashed border-ink-700 md:w-[48vw] lg:w-[38vw]">
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink-500">
                end-of-stream
              </div>
              <div className="mt-3 font-display text-2xl text-ink-400">— 记忆到此分叉 —</div>
            </div>
          </div>
        </div>

        {/* Progress HUD */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-ink-500">
          <span>scrub</span>
          <div className="relative h-[2px] w-32 bg-ink-700/60">
            <div className="absolute left-0 top-0 h-full w-1/3 bg-neon-yellow" />
          </div>
          <span>scroll ↓</span>
        </div>
      </div>
    </section>
  );
}
