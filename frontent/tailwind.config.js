const config = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Light, professional neutral scale. Names kept as "ink"/"fog" so no
        // component files needed to change — only the palette values did.
        ink: {
          950: "#0F172A",
          // dark text-on-accent (button labels) + footer band
          900: "#F7F8FA",
          // page background
          800: "#FFFFFF",
          // card / input surface
          700: "#E5E9F0",
          // subtle borders, placeholders
          600: "#D8DEE9",
          // input borders
          500: "#B9C2D0"
        },
        fog: {
          100: "#0F172A",
          // primary heading/body text
          300: "#334155",
          // secondary text
          500: "#64748B",
          // muted text, placeholders
          700: "#94A3B8"
          // faint/disabled text
        },
        trace: {
          DEFAULT: "#0D9488",
          dim: "#0F766E",
          glow: "#14B8A6"
        },
        amber: {
          DEFAULT: "#F59E0B",
          dim: "#B45309"
        },
        danger: "#DC2626"
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      backgroundImage: {
        "grid-fade": "linear-gradient(to bottom, rgba(13,148,136,0.05), transparent 60%)"
      },
      boxShadow: {
        trace: "0 0 0 1px rgba(13,148,136,0.25), 0 4px 14px rgba(13,148,136,0.12)"
      }
    }
  },
  plugins: []
};
var stdin_default = config;
export {
  stdin_default as default
};
