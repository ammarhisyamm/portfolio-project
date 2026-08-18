import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#faf9f6",
        panel: "#ffffff",
        ink: "#141414",
        sub: "#6a675f",
        muted: "#9a978f",
        line: "#e7e4de",
        "line-strong": "#d9d6cf",
        accent: "#3da06a",
        "accent-soft": "#e7f4ec",
        "accent-ink": "#2c7a4c",
      },
      borderRadius: {
        panel: "2px",
        card: "2px",
        chip: "9999px",
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', "Helvetica", "Arial", "Inter", '"Segoe UI"', "sans-serif"],
        mono: ['"SFMono-Regular"', "ui-monospace", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(20,20,20,.03)",
      },
      maxWidth: {
        shell: "650px",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 2.4s cubic-bezier(.16,1,.3,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;