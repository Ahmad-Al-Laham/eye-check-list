import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f4f7f6",
          100: "#e3ebe8",
          200: "#c5d6d0",
          300: "#9bb8ae",
          400: "#6d9487",
          500: "#4f776c",
          600: "#3d5f56",
          700: "#334d46",
          800: "#2c403b",
          900: "#273632",
          950: "#141d1b",
        },
        mint: {
          400: "#5ecfad",
          500: "#2bb98f",
          600: "#1f9573",
        },
        coral: {
          400: "#f07a6a",
          500: "#e85a46",
          600: "#d13d28",
        },
        sun: {
          400: "#f5c84c",
          500: "#e8b02a",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "Tahoma", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(20, 29, 27, 0.08)",
        lift: "0 12px 40px rgba(20, 29, 27, 0.14)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", opacity: "0.7" },
          "70%": { transform: "scale(1.15)", opacity: "0" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(-3px)" },
          "80%": { transform: "translateX(3px)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slide-up 0.35s ease-out",
        shake: "shake 0.45s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
