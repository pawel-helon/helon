import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindScrollbar from "tailwind-scrollbar";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      "xs": "480px",
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        "background-sh": "hsl(var(--background-sh))",
        "background-h": "hsl(var(--background-h))",
        "foreground-h": "hsl(var(--foreground-h))",
        "muted-h": "hsl(var(--muted-h))",
        "muted-foreground-h": "hsl(var(--muted-foreground-h))",
        "accent-yellow-h": "hsl(var(--accent-yellow-h))",
        "accent-orange-h": "hsl(var(--accent-orange-h))",
        "accent-pink-h": "hsl(var(--accent-pink-h))",
        "border-h": "hsl(var(--border-h))",
        "background-sh-hover": "hsl(var(--background-sh-hover))"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "scale": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)"}
        },
        "scale-140": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.4)"}
        },
        "scale-160": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.6)"}
        },
      },
      animation: {
        "scale": "scale 3s ease-in-out infinite",
        "scale-140": "scale-140 2s ease-in-out infinite",
        "scale-160": "scale-160 1s ease-in-out infinite",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    tailwindScrollbar({
      nocompatible: true,
      preferredStrategy: "pseudoelements",
    }),
  ],
};
export default config;
