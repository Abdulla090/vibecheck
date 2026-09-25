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
        sans: ["Manrope", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        bg: "#10110f",
        surface: "#191a17",
        line: "#2e3029",
        "line-strong": "#f2f3ed",
        acid: {
          DEFAULT: "#bce83e",
          ink: "#101408",
        },
        signal: "#ff7055",
        code: {
          DEFAULT: "#0b0c0a",
          ink: "#e9ecdf",
        },
      },
    },
  },
  plugins: [],
};

export default config;
