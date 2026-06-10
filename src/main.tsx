import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import App from "./App";
import "./index.css";

gsap.registerPlugin(ScrollTrigger);

// Expose globally so components can share the raf loop
declare global {
  interface Window {
    __lenis?: Lenis;
    __gsapReady?: boolean;
  }
}

function Bootstrap() {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!reduced) {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
      });

      window.__lenis = lenis;

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Sync GSAP ScrollTrigger with Lenis
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.lagSmoothing(0);

      // Pause rendering cycles when tab is hidden
      const onVisibility = () => {
        if (document.hidden) {
          gsap.ticker.sleep();
        } else {
          gsap.ticker.wake();
        }
      };
      document.addEventListener("visibilitychange", onVisibility);

      return () => {
        lenis.destroy();
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }
    window.__gsapReady = true;
    return () => {
      // no-op cleanup
    };
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Bootstrap />
  </StrictMode>
);
