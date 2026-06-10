import { useRef } from "react";
import HeroSection from "./components/sections/HeroSection";
import WorldviewSection from "./components/sections/WorldviewSection";
import CharacterSection from "./components/sections/CharacterSection";
import GallerySection from "./components/sections/GallerySection";
import TechSpecSection from "./components/sections/TechSpecSection";
import FooterSection from "./components/sections/FooterSection";
import ParticleBackground from "./components/ui/ParticleBackground";

export default function App() {
  const progressRef = useRef({ value: 0 });

  return (
    <div className="relative min-h-screen">
      {/* 全局固定背景 - 贯穿所有区块 */}
      <div className="fixed inset-0 z-0">
        <ParticleBackground progress={progressRef.current.value} density="high" />
        {/* 渐变遮罩让背景与内容过渡更自然 */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/30 via-transparent to-ink-950/50" />
      </div>

      {/* 内容层 */}
      <main className="relative z-10 w-full overflow-x-hidden bg-transparent text-ink-50">
        <HeroSection />
        <WorldviewSection />
        <CharacterSection />
        <GallerySection />
        <TechSpecSection />
        <FooterSection />
      </main>
    </div>
  );
}
