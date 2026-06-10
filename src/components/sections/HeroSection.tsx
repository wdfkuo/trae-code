import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

const TITLE_1 = "E N D E R";
const TITLE_2 = "终端协议 / 001";

export default function HeroSection() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const particleProgress = useRef({ value: 0 });
  const [, setTick] = useState(0);

  useEffect(() => {
    import("gsap").then(({ gsap }) => {
      const charEls = rootRef.current?.querySelectorAll<HTMLElement>(
        "[data-char] > span"
      );
      if (charEls) {
        gsap.to(charEls, {
          y: 0,
          duration: 1.1,
          stagger: 0.03,
          ease: "power3.out",
          delay: 0.2,
        });
      }

      const subtitle = rootRef.current?.querySelector<HTMLElement>(
        "[data-subtitle]"
      );
      if (subtitle) {
        gsap.fromTo(
          subtitle,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 1.2, delay: 1.3, ease: "power3.out" }
        );
      }

      const taglines = rootRef.current?.querySelectorAll<HTMLElement>(
        "[data-tagline]"
      );
      if (taglines) {
        gsap.fromTo(
          taglines,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            delay: 1.7,
            ease: "power3.out",
          }
        );
      }

      const scrollIndicator =
        rootRef.current?.querySelector<HTMLElement>("[data-scroll-indicator]");
      if (scrollIndicator) {
        gsap.to(scrollIndicator, {
          y: 12,
          duration: 1.4,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
          delay: 2.2,
        });
      }

      gsap.to(particleProgress.current, {
        value: 1,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          onUpdate: () => setTick((t) => (t + 1) % 1000000),
        },
      });

      const overlay = rootRef.current?.querySelector<HTMLElement>(
        "[data-hero-overlay]"
      );
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.75,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    });
  }, []);

  const title1Chars = TITLE_1.split("");
  const title2Chars = TITLE_2.split("");

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] w-full items-end overflow-hidden"
      id="hero"
    >
      <div className="absolute inset-0">
        {/* 背景已由全局 ParticleBackground 提供 */}
        <div
          data-hero-overlay
          className="absolute inset-0"
          style={{
            opacity: 0.18,
            background:
              "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 0%, rgba(10,10,15,0.9) 75%)",
          }}
        />
        <div className="noise" />
      </div>

      <div className="pointer-events-none absolute inset-8 border-l border-t border-neon-yellow/20" />
      <div className="pointer-events-none absolute bottom-8 right-8 h-6 w-6 border-b border-r border-neon-yellow/20" />

      <div className="container relative z-10 flex h-full flex-col justify-end pb-24 md:pb-28">
        <div className="mb-10 flex items-end justify-between">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink-400">
            <div>sig://ender-node-001</div>
            <div className="mt-1 text-neon-yellow/80">
              liveness · {new Date().getUTCFullYear()}.Q3
            </div>
          </div>
          <div className="hidden md:block text-right font-mono text-[10px] uppercase tracking-[0.4em] text-ink-400">
            <div>lat 31.23°N</div>
            <div>lng 121.47°E</div>
            <div className="text-neon-cyan/80 mt-1">sector-7 · unstable</div>
          </div>
        </div>

        <h1 className="font-display font-black leading-[0.9] tracking-tight text-ink-50">
          <div className="text-[clamp(3rem,11vw,11.5rem)]">
            {title1Chars.map((c, i) => (
              <span
                key={i}
                data-char
                className="char-mask inline-block"
                aria-hidden="true"
              >
                <span>{c === " " ? "\u00A0" : c}</span>
              </span>
            ))}
          </div>
          <div className="mt-3 text-[clamp(1.1rem,3.4vw,3.4rem)] font-light tracking-[0.35em] text-neon-yellow neon-text">
            {title2Chars.map((c, i) => (
              <span
                key={i}
                data-char
                className="char-mask inline-block"
                aria-hidden="true"
              >
                <span>{c === " " ? "\u00A0" : c}</span>
              </span>
            ))}
          </div>
        </h1>

        <p
          data-subtitle
          className="mt-8 max-w-xl text-base leading-relaxed text-ink-300 md:text-lg"
        >
          一次关于终端、信号与记忆的交互实验。向下滚动以接收自遥远扇区返回的数据流。
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-6 font-mono text-[11px] uppercase tracking-[0.3em] text-ink-400">
          <span data-tagline className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-yellow shadow-[0_0_10px_rgba(245,255,0,0.8)]" />
            signal-acquired · 48%
          </span>
          <span data-tagline>decoder · v0.2.1</span>
          <span data-tagline className="text-neon-cyan/80">
            tap-scroll ↓
          </span>
        </div>

        <div
          data-scroll-indicator
          className="mt-16 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-ink-400"
        >
          <span>scroll</span>
          <ArrowDown size={14} strokeWidth={1.5} />
        </div>
      </div>
    </section>
  );
}
