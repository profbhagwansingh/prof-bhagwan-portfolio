import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#eef0fb",
          100: "#d5d9f5",
          200: "#aab3eb",
          300: "#8090e0",
          400: "#6070d5",
          500: "#5061C4",
          600: "#4050a8",
          700: "#32408a",
          800: "#25306b",
          900: "#18204d",
        },
        ink: {
          DEFAULT: "#1a1a2e",
          soft:    "#3d3d5c",
          muted:   "#6b6b8a",
          faint:   "#a0a0b8",
        },
        parchment: {
          DEFAULT: "#faf9f7",
          warm:    "#f5f3ef",
          border:  "#e8e5df",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body:    ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 4vw, 3.5rem)",   { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.2",  letterSpacing: "-0.01em" }],
      },
      spacing: {
        "section": "6rem",
        "section-sm": "4rem",
      },
      boxShadow: {
        "card":    "0 2px 20px rgba(80, 97, 196, 0.08), 0 1px 4px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 40px rgba(80, 97, 196, 0.15), 0 2px 8px rgba(0,0,0,0.06)",
        "nav":     "0 1px 0 rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)",
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.5rem",
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        "fade-up":   "fadeUp 0.6s ease forwards",
        "fade-in":   "fadeIn 0.4s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;