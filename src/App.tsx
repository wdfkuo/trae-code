import HeroSection from "./components/sections/HeroSection";
import WorldviewSection from "./components/sections/WorldviewSection";
import CharacterSection from "./components/sections/CharacterSection";
import GallerySection from "./components/sections/GallerySection";
import TechSpecSection from "./components/sections/TechSpecSection";
import FooterSection from "./components/sections/FooterSection";

export default function App() {
  return (
    <main className="relative w-full overflow-x-hidden bg-ink-950 text-ink-50">
      <HeroSection />
      <WorldviewSection />
      <CharacterSection />
      <GallerySection />
      <TechSpecSection />
      <FooterSection />
    </main>
  );
}
