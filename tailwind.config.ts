import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f5f5f5",
        panel: "#ffffff",
        ink: "#161616",
        sub: "#686868",
        muted: "#929292",
        line: "#e9e9e9",
        "line-strong": "#e4e4e4",
        accent: "#3da06a",
        "accent-soft": "#e7f4ec",
        "accent-ink": "#2c7a4c",
      },
      borderRadius: {
        panel: "24px",
        card: "18px",
        chip: "12px",
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', "Helvetica", "Arial", "Inter", '"Segoe UI"', "sans-serif"],
        mono: ['"SFMono-Regular"', "ui-monospace", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(22,22,22,.04), 0 8px 24px -12px rgba(22,22,22,.06)",
      },
      maxWidth: {
        shell: "1180px",
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