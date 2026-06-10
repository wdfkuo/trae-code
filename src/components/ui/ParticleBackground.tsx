import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ParticleBackgroundProps {
  /** 0 = hero entrance, 1 = fully pushed/zoom through */
  progress?: number;
  density?: "low" | "medium" | "high";
  className?: string;
}

/**
 * Three.js 粒子星云背景。
 * - 粒子缓慢旋转 + 随滚动推进 camera.position.z
 * - 根据屏幕大小选择粒子数量
 * - camera-z 由父组件通过 GSAP 写入 progress 控制
 */
export default function ParticleBackground({
  progress = 0,
  density = "high",
  className = "",
}: ParticleBackgroundProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const progressRef = useRef(progress);
  const visibleRef = useRef(true);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // --- Scene ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.0018);

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 4000);
    camera.position.set(0, 0, 420);
    cameraRef.current = camera;

    // --- Particles ---
    const countByDensity = {
      low: 1500,
      medium: 3500,
      high: 8000,
    };
    const count = countByDensity[density];

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const palette = [
      new THREE.Color("#F5FF00"),
      new THREE.Color("#00E5FF"),
      new THREE.Color("#FF3EA5"),
      new THREE.Color("#e9e9f2"),
      new THREE.Color("#8a8a9a"),
    ];

    for (let i = 0; i < count; i++) {
      // Sphere-ish distribution biased outward
      const r = 300 + Math.random() * 1400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 200;
      positions[i * 3 + 2] = r * Math.cos(phi);

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 0.5 + Math.random() * 2.2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Circular sprite texture via canvas
    const makeSprite = () => {
      const size = 128;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      const grd = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      );
      grd.addColorStop(0, "rgba(255,255,255,1)");
      grd.addColorStop(0.25, "rgba(255,255,255,0.65)");
      grd.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    };

    const material = new THREE.PointsMaterial({
      size: 2.2,
      map: makeSprite(),
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    pointsRef.current = points;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({
      antialias: window.devicePixelRatio < 2,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- Loop ---
    let frame = 0;
    let lastProgress = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visibleRef.current) return;

      const t = performance.now() * 0.00008;
      points.rotation.y = t * 0.6;
      points.rotation.x = Math.sin(t * 0.8) * 0.1;

      // Smooth progress-driven camera push
      const target = progressRef.current;
      lastProgress += (target - lastProgress) * 0.08;
      const baseZ = 420 - lastProgress * 360;
      camera.position.z = Math.max(30, baseZ);
      camera.position.y = Math.sin(t * 1.5) * 8;
      camera.lookAt(0, 0, 0);

      // Slight scale shimmer
      const s = 1 + Math.sin(performance.now() * 0.0005) * 0.004;
      points.scale.setScalar(s);

      renderer.render(scene, camera);
    };
    tick();

    // --- Resize ---
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // --- Visibility ---
    const onVis = () => {
      visibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [density]);

  return (
    <div
      ref={mountRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  );
}
