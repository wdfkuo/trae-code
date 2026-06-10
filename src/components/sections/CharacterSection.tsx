import { useState } from "react";
import HexRadar from "../ui/HexRadar";

interface Character {
  id: string;
  code: string;
  name: string;
  role: string;
  accent: string;
  short: string;
  stats: { label: string; value: number }[];
}

const CHARACTERS: Character[] = [
  {
    id: "a1",
    code: "PGR-01",
    name: "执行者-α",
    role: "先锋 / 侦察型",
    accent: "#F5FF00",
    short:
      "高机动性作战单位，擅长快速部署与区域侦察。配备轻型能量武器，适合突破防线。",
    stats: [
      { label: "攻击", value: 0.75 },
      { label: "生存", value: 0.45 },
      { label: "机动", value: 0.92 },
      { label: "控制", value: 0.4 },
      { label: "辅助", value: 0.55 },
      { label: "爆发", value: 0.7 },
    ],
  },
  {
    id: "k2",
    code: "PGR-02",
    name: "铁壁-β",
    role: "重装 / 防御型",
    accent: "#00E5FF",
    short:
      "重装甲作战单位，具备超强的防御与区域控制能力。以近战压制为主要战术。",
    stats: [
      { label: "攻击", value: 0.65 },
      { label: "生存", value: 0.95 },
      { label: "机动", value: 0.35 },
      { label: "控制", value: 0.8 },
      { label: "辅助", value: 0.5 },
      { label: "爆发", value: 0.55 },
    ],
  },
  {
    id: "v3",
    code: "PGR-03",
    name: "空灵-γ",
    role: "术师 / 支援型",
    accent: "#FF3EA5",
    short:
      "远程火力支援单位，能够对大范围区域造成持续伤害。同时具备一定的治疗能力。",
    stats: [
      { label: "攻击", value: 0.88 },
      { label: "生存", value: 0.35 },
      { label: "机动", value: 0.5 },
      { label: "控制", value: 0.65 },
      { label: "辅助", value: 0.75 },
      { label: "爆发", value: 0.9 },
    ],
  },
];

export default function CharacterSection() {
  const [active, setActive] = useState(0);
  const char = CHARACTERS[active];

  return (
    <section
      id="characters"
      className="relative min-h-[110svh] w-full overflow-hidden py-24"
    >
      {/* 渐变遮罩增强沉浸感 */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-950/40 pointer-events-none" />
      <div className="noise opacity-30" />
      <div className="container relative z-10">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <span className="label-chip">03 · operators</span>
            <h2 className="mt-6 font-display text-[clamp(1.8rem,4.5vw,3.6rem)] font-bold leading-[1.05] text-ink-50">
              干员档案 ·
              <span className="text-ink-400">三位执行者 / 一条链路</span>
            </h2>
          </div>
          <div className="hidden font-mono text-[10px] uppercase tracking-[0.35em] text-ink-500 md:block text-right">
            sector-7 / clearance-lvl-2
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-12">
          {/* Character list / cards */}
          <div className="md:col-span-6">
            <div className="grid gap-5">
              {CHARACTERS.map((c, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActive(i)}
                    className={`group relative overflow-hidden rounded-sm border text-left transition-all ${
                      isActive
                        ? "border-ink-50 bg-ink-800"
                        : "border-ink-700/60 bg-ink-800/40 hover:border-ink-500"
                    }`}
                    style={{
                      boxShadow: isActive
                        ? `0 0 0 1px ${c.accent}44, 0 20px 60px -20px ${c.accent}44`
                        : "none",
                    }}
                  >
                    <div className="flex items-stretch">
                      {/* Silhouette */}
                      <div
                        className="relative flex h-36 w-28 shrink-0 items-center justify-center md:h-44 md:w-36"
                        style={{
                          background: `linear-gradient(180deg, ${c.accent}18, rgba(10,10,15,0))`,
                        }}
                      >
                        <svg
                          viewBox="0 0 100 140"
                          className="h-full w-full"
                          aria-hidden="true"
                        >
                          <defs>
                            <linearGradient
                              id={`sil-${c.id}`}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor={c.accent}
                                stopOpacity={isActive ? 0.9 : 0.45}
                              />
                              <stop
                                offset="100%"
                                stopColor={c.accent}
                                stopOpacity={isActive ? 0.1 : 0.05}
                              />
                            </linearGradient>
                          </defs>
                          <g fill={`url(#sil-${c.id})`}>
                            <circle cx="50" cy="28" r="14" />
                            <path d="M28,58 Q50,46 72,58 L78,110 L66,130 L34,130 L22,110 Z" />
                          </g>
                          {/* Scanline */}
                          {isActive && (
                            <rect
                              x="10"
                              y="50"
                              width="80"
                              height="40"
                              fill={c.accent}
                              opacity="0.08"
                            >
                              <animate
                                attributeName="y"
                                values="20;120;20"
                                dur="3.2s"
                                repeatCount="indefinite"
                              />
                            </rect>
                          )}
                        </svg>
                        <div
                          className="absolute inset-0"
                          style={{
                            background: isActive
                              ? `linear-gradient(180deg, ${c.accent}14, transparent 60%)`
                              : "transparent",
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 p-5">
                        <div className="flex items-center gap-3">
                          <span
                            className="font-mono text-[10px] uppercase tracking-[0.35em]"
                            style={{ color: c.accent }}
                          >
                            {c.code}
                          </span>
                          <span className="text-ink-500 font-mono text-[10px] uppercase tracking-[0.35em]">
                            {c.role}
                          </span>
                        </div>
                        <div className="mt-3 font-display text-2xl font-bold text-ink-50 md:text-3xl">
                          {c.name}
                        </div>
                        <p className="mt-3 text-sm leading-6 text-ink-400">
                          {c.short}
                        </p>
                        <div className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.35em] text-ink-500">
                          <span
                            className="inline-block h-1.5 w-1.5 rounded-full"
                            style={{
                              background: c.accent,
                              boxShadow: `0 0 8px ${c.accent}`,
                            }}
                          />
                          <span>
                            {isActive ? "currently observing" : "tap to observe"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Accent bar */}
                    <div
                      className="absolute bottom-0 left-0 h-[2px] transition-all duration-700"
                      style={{
                        width: isActive ? "100%" : "0%",
                        background: c.accent,
                        boxShadow: `0 0 12px ${c.accent}`,
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Radar + detail */}
          <div className="md:col-span-6">
            <div className="relative h-full rounded-sm border border-ink-700/50 bg-ink-800/30 p-8">
              <div className="flex items-start justify-between">
                <div>
                  <div
                    className="font-mono text-[10px] uppercase tracking-[0.35em]"
                    style={{ color: char.accent }}
                  >
                    target · {char.code}
                  </div>
                  <div className="mt-2 font-display text-3xl font-bold text-ink-50 md:text-5xl">
                    {char.name}
                  </div>
                </div>
                <div className="text-right font-mono text-[10px] uppercase tracking-[0.35em] text-ink-500">
                  <div>clearance</div>
                  <div className="text-neon-yellow">2 / 5</div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center">
                <HexRadar stats={char.stats} accent={char.accent} size={320} />
              </div>

              {/* Stats bar */}
              <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.3em]">
                {char.stats.map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-ink-400">
                      <span>{s.label}</span>
                      <span style={{ color: char.accent }}>
                        {Math.round(s.value * 100)}
                      </span>
                    </div>
                    <div className="mt-1 h-[2px] w-full bg-ink-700/60">
                      <div
                        className="h-full"
                        style={{
                          width: `${s.value * 100}%`,
                          background: char.accent,
                          boxShadow: `0 0 8px ${char.accent}`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-sm leading-7 text-ink-400">{char.short}</p>

              {/* Corner frame */}
              <div className="pointer-events-none absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-ink-500/70" />
              <div className="pointer-events-none absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2 border-ink-500/70" />
              <div className="pointer-events-none absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-ink-500/70" />
              <div className="pointer-events-none absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-ink-500/70" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
