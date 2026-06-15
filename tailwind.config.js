/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        "border-2": "#333d4f",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        bg: "#0a0e15",
        "bg-2": "#0e131c",
        surface: "#141a24",
        "surface-2": "#1d2331",
        "surface-3": "#262e3e",
        ink: {
          DEFAULT: "#eef2f7",
          muted: "#9aa6b6",
          faint: "#626d7e",
        },
        lime: {
          DEFAULT: "#8eff01",
          600: "#7ee000",
          700: "#69bd00",
          soft: "rgba(142,255,1,.14)",
        },
        purple: {
          DEFAULT: "#8b53fe",
          600: "#7a3ff0",
          700: "#6730d6",
          soft: "rgba(139,83,254,.16)",
        },
        danger: {
          DEFAULT: "#ff4d6a",
          soft: "rgba(255,77,106,.14)",
        },
        warning: "#ffb43d",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "22px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,.03) inset, 0 18px 40px -24px rgba(0,0,0,.8)",
        "glow-lime":
          "0 0 0 1px rgba(142,255,1,.5), 0 8px 30px -8px rgba(142,255,1,.45)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
