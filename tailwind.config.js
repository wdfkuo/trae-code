/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0A0A0F",
          900: "#0D0D14",
          800: "#12121A",
          700: "#1A1A24",
          600: "#2A2A3A",
          500: "#4A4A5A",
          400: "#8A8A9A",
          300: "#B5B5C5",
        },
        neon: {
          yellow: "#F5FF00",
          cyan: "#00E5FF",
          pink: "#FF3EA5",
        },
      },
      fontFamily: {
        display: [
          "Orbitron",
          "Space Grotesk",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.35em",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 18s linear infinite",
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        md: "2rem",
        lg: "4rem",
      },
    },
  },
  plugins: [],
};
