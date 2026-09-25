import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        kurdish: ["Vazirmatn", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        obsidian: {
          950: "#070A0F",
          900: "#0B0F17",
          850: "#0E1420",
          800: "#121826",
          750: "#161F33",
          700: "#1E293B",
          600: "#334155",
        },
        emerald: {
          surgical: "#10B981",
          bright: "#34D399",
          deep: "#047857",
        },
        champagne: {
          300: "#FDF6E2",
          400: "#F5E6C8",
          500: "#E6C280",
          600: "#D4AF37",
          700: "#B89327",
        },
      },
      boxShadow: {
        glow: "0 0 35px -5px rgba(16, 185, 129, 0.22)",
        gold: "0 0 35px -5px rgba(212, 175, 55, 0.18)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      },
      borderWidth: {
        hairline: "1px",
      },
    },
  },
  plugins: [],
};

export default config;
