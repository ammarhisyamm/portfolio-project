import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f4f4f1",
        panel: "#ffffff",
        ink: "#16161a",
        sub: "#5f5f5a",
        muted: "#a3a39d",
        line: "#e6e6e2",
        "line-strong": "#d8d8d3",
        accent: "#3da06a",
        "accent-soft": "#e7f4ec",
        "accent-ink": "#2c7a4c",
      },
      borderRadius: {
        panel: "28px",
        card: "20px",
        chip: "12px",
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', "Helvetica", "Arial", "Inter", '"Segoe UI"', "sans-serif"],
        mono: ['"SFMono-Regular"', "ui-monospace", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(22,22,26,.04), 0 12px 32px -8px rgba(22,22,26,.08)",
      },
      maxWidth: {
        shell: "1280px",
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