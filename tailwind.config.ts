/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── COLORES TOTALFLEXGYM ─────────────────────────────
      colors: {
        brand: {
          // Fondos
          black:  "#09090B",   // Fondo base absoluto
          surface: "#111113",  // Tarjetas, superficies elevadas
          border:  "#27272A",  // Bordes de grid, divisores

          // Acento: Rojo oscuro (primario)
          red: {
            DEFAULT: "#991B1B", // Rojo oscuro — CTA principal
            dark:    "#7F1D1D", // Hover sombra / profundidad
            bright:  "#DC2626", // Hover activo / foco
            muted:   "#450A0A", // Fondo sutil de alertas rojas
          },

          // Gris metálico
          metal: {
            DEFAULT: "#52525B", // Gris medio
            light:   "#A1A1AA", // Texto secundario
            dark:    "#3F3F46", // Superficies metálicas oscuras
          },

          // Texto
          white: "#FAFAFA",     // Texto principal
        },
      },

      // ── TIPOGRAFÍA ───────────────────────────────────────
      fontFamily: {
        // Display: títulos de impacto, UPPERCASE, condensada
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
        // UI: cuerpo, etiquetas, datos
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },

      // ── TAMAÑOS DE FUENTE (escala de impacto) ────────────
      fontSize: {
        "display-xl": ["7rem",  { lineHeight: "1",   letterSpacing: "0.04em" }],
        "display-lg": ["5rem",  { lineHeight: "1",   letterSpacing: "0.04em" }],
        "display-md": ["3.5rem", { lineHeight: "1.05", letterSpacing: "0.03em" }],
        "display-sm": ["2.5rem", { lineHeight: "1.1",  letterSpacing: "0.02em" }],
      },

      // ── ESPACIADO ────────────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      // ── BORDES ──────────────────────────────────────────
      borderWidth: {
        "3": "3px",
      },

      // ── SOMBRAS ─────────────────────────────────────────
      boxShadow: {
        // Sombra de impacto roja para CTAs
        "red-glow":   "0 0 20px rgba(153, 27, 27, 0.4), 0 0 40px rgba(153, 27, 27, 0.2)",
        "red-inset":  "inset 0 1px 0 rgba(220, 38, 38, 0.15)",
        // Sombra metálica para tarjetas
        "metal-card": "0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
      },

      // ── ANIMACIONES RÁPIDAS (anti-slop) ─────────────────
      transitionTimingFunction: {
        "brutal": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        "150": "150ms",
        "200": "200ms",
      },

      // ── BREAKPOINTS (Mobile-First) ───────────────────────
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};

export default config;
