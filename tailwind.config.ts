import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F3EC",
        ink: "#2B2521",
        panel: "#21201D",
        accent: {
          DEFAULT: "#4F6F52",
          dark: "#3B5540",
        },
        accent2: {
          DEFAULT: "#B5652D",
          dark: "#96521F",
        },
        line: "#DCD4C3",
        muted: "#8A8072",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
