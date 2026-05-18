import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#080a0f",
        surface: "#0e1117",
        surface2: "#141820",
        surface3: "#1c2230",
        border: "rgba(255,255,255,0.07)",
        accent: "#7c5cfc",
        "accent-light": "#9d82fd",
        "accent-dim": "rgba(124,92,252,0.15)",
        cyan: "#00e5ff",
        muted: "#6b7280",
        "text-primary": "#f0f2f8",
        "text-secondary": "#9ca3af",
      },
      fontFamily: {
        sans: ["Syne", "system-ui", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "slide-up": "slideUp 0.3s ease",
        "fade-in": "fadeIn 0.4s ease",
      },
      keyframes: {
        glow: {
          from: { boxShadow: "0 0 20px rgba(124,92,252,0.3)" },
          to: { boxShadow: "0 0 40px rgba(124,92,252,0.6)" },
        },
        slideUp: {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      backdropBlur: { xs: "2px" },
      boxShadow: {
        accent: "0 0 30px rgba(124,92,252,0.25)",
        "accent-sm": "0 0 12px rgba(124,92,252,0.2)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
