import { useEffect, useRef } from "react";
import { ArrowUp, Github, Globe } from "lucide-react";

export default function FooterSection() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    import("gsap").then(({ gsap }) => {
      const items = rootRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 75%",
            },
          }
        );
      }
    });
  }, []);

  return (
    <footer
      id="end"
      ref={rootRef}
      className="relative min-h-[70svh] w-full overflow-hidden pt-20"
    >
      {/* 渐变遮罩增强沉浸感 */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent pointer-events-none" />
      <div className="noise opacity-30" />

      {/* Big end statement */}
      <div className="container relative z-10">
        <div className="mb-16 flex flex-col items-center text-center">
          <span className="label-chip" data-reveal>
            end · signal
          </span>
          <h2
            data-reveal
            className="mt-8 font-display text-[clamp(2.4rem,8vw,7.5rem)] font-black leading-[1.02] text-ink-50"
          >
            终端·协议·结束
          </h2>
          <p
            data-reveal
            className="mt-6 max-w-xl text-sm leading-7 text-ink-400"
          >
            你刚刚完成了一次从 hero 到 footer 的完整数据流滚动。
            向上滚动，所有动画将按时间轴倒序回放。
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          <div data-reveal>
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink-500">
              origin
            </div>
            <div className="mt-4 font-display text-xl font-semibold text-ink-50">
              ENDER / 终端协议
            </div>
            <p className="mt-2 text-sm leading-6 text-ink-400">
              A scroll-driven single-page experience, built as an internal style
              reference for narrative-first interfaces.
            </p>
          </div>

          <div data-reveal>
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink-500">
              stack
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-ink-400">
              <li>React 18 · TypeScript · Vite</li>
              <li>Tailwind CSS · GSAP ScrollTrigger</li>
              <li>Lenis smooth-scroll · Three.js particles</li>
            </ul>
          </div>

          <div data-reveal>
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink-500">
              channel
            </div>
            <div className="mt-4 flex items-center gap-4">
              <a
                href="#"
                className="group inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-neon-yellow"
              >
                <Github size={16} />
                <span>source</span>
              </a>
              <a
                href="#"
                className="group inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-neon-cyan"
              >
                <Globe size={16} />
                <span>studio</span>
              </a>
            </div>
            <button
              onClick={() => {
                if (typeof window === "undefined") return;
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="mt-8 inline-flex items-center gap-2 rounded-sm border border-ink-700 bg-ink-900 px-4 py-3 text-xs uppercase tracking-[0.35em] text-ink-300 transition hover:border-neon-yellow hover:text-neon-yellow"
            >
              <ArrowUp size={14} />
              <span>back-to-signal</span>
            </button>
          </div>
        </div>

        <div
          data-reveal
          className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-ink-800 pt-6 font-mono text-[10px] uppercase tracking-[0.35em] text-ink-500 md:flex-row md:items-center"
        >
          <span>© {new Date().getUTCFullYear()} · ender-protocol · all-signals-reserved</span>
          <span className="text-neon-yellow/80">signal-strength · max</span>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-ink-950 to-transparent" />
    </footer>
  );
}
