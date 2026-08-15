"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

// ── HERO SECTION — TotalFlexGym ───────────────────────────────
// Imagen de fondo: foto grupal del equipo
// Paleta: dark (#09090B), rojo (#991B1B), blanco (#FAFAFA), gris metálico
// Tipografía: Barlow Black (héroe título) / Bebas Neue (display) / Inter (body)
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll progress del hero: 0 = arriba del hero, 1 = hero fuera de pantalla
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax: imagen sube más lento que el scroll (profundidad)
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Contenido del hero: se desvanece y sube al hacer scroll
  const contentY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-screen flex flex-col overflow-hidden"
    >
      {/* ── IMAGEN DE FONDO CON PARALLAX ───────────────────────── */}
      {/* El wrapper se extiende ±20% para que el parallax no muestre bordes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute"
          style={{
            top: "-20%", left: 0, right: 0, bottom: "-20%",
            y: imageY,
          }}
        >
          <Image
            src="/foto-hero.png"
            alt="Equipo TotalFlexGym Loja"
            fill
            priority
            quality={90}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
        </motion.div>
        {/* Overlay degradado — funde completamente la imagen en negro hacia abajo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(9,9,11,0.6) 0%, rgba(9,9,11,0.4) 30%, rgba(9,9,11,0.7) 65%, rgba(9,9,11,0.95) 85%, rgba(9,9,11,1) 100%)",
          }}
          aria-hidden="true"
        />
        {/* Bloque sólido en el fondo para que no haya corte visible */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: "80px", background: "linear-gradient(to bottom, transparent, #09090B)" }}
          aria-hidden="true"
        />
        {/* Overlay lateral sutil para profundidad */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(9,9,11,0.4) 0%, transparent 40%, transparent 60%, rgba(9,9,11,0.4) 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── HEADER / NAVBAR ─────────────────────────────────── */}
      <header className="relative z-10 w-full">
        <div className="container-base flex items-center justify-between py-5">

          {/* Logo */}
          <a href="/" aria-label="TotalFlexGym — Inicio">
            <Image
              src="/logo-totalflex.png"
              alt="TotalFlexGym Logo"
              width={160}
              height={60}
              priority
              style={{ width: "160px", height: "auto", objectFit: "contain" }}
            />
          </a>

          {/* Nav links — Desktop */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            <a
              href="#disciplinas"
              className="text-brand-metal-light hover:text-brand-white transition-colors duration-150 font-sans text-sm font-medium tracking-wide uppercase"
            >
              Disciplinas
            </a>
            <a
              href="#instalaciones"
              className="text-brand-metal-light hover:text-brand-white transition-colors duration-150 font-sans text-sm font-medium tracking-wide uppercase"
            >
              Instalaciones
            </a>
            <a
              href="#nosotros"
              className="text-brand-metal-light hover:text-brand-white transition-colors duration-150 font-sans text-sm font-medium tracking-wide uppercase"
            >
              Nosotros
            </a>
          </nav>

          {/* CTA Header */}
          <a
            id="header-ver-planes"
            href="#planes"
            className="btn-secondary text-sm px-5 py-3 font-display tracking-widest border-brand-border hover:border-brand-red hover:text-brand-white transition-all duration-150"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.95rem",
              letterSpacing: "0.12em",
            }}
          >
            VER PLANES
          </a>
        </div>
      </header>

      {/* ── CONTENIDO CENTRAL DEL HERO ──────────────────────── */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pb-20 pt-8"
        style={{ y: contentY, opacity: contentOpacity }}
      >

        {/* Título principal — Barlow Black, letras anchas y grandes */}
        <h1
          className="text-brand-white w-full"
          style={{
            fontFamily: "var(--font-barlow), 'Barlow', Impact, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(3rem, 13vw, 14rem)",
            lineHeight: "0.9",
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            textShadow: "0 4px 40px rgba(0,0,0,0.8), 0 2px 12px rgba(0,0,0,0.6)",
          }}
        >
          TOTALFLEX
          <span
            style={{
              display: "block",
              WebkitTextStroke: "3px #FAFAFA",
              color: "transparent",
              textShadow: "none",
            }}
          >
            GYM
          </span>
        </h1>

        {/* Texto secundario */}
        <p
          className="uppercase mt-6 mb-10"
          style={{
            fontFamily: "var(--font-barlow), 'Barlow', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(1.25rem, 3.5vw, 2.25rem)",
            letterSpacing: "0.18em",
            color: "var(--red-bright)",
            textShadow: "0 0 20px rgba(220,38,38,0.4), 0 2px 12px rgba(0,0,0,0.8)",
          }}
        >
          El gimnasio mas grande de Loja
        </p>

        {/* Línea decorativa roja */}
        <div
          className="h-px w-24 bg-brand-red mb-10"
          aria-hidden="true"
          style={{ boxShadow: "0 0 12px rgba(153,27,27,0.7)" }}
        />

        {/* Botón CTA principal */}
        <a
          id="hero-inscribete"
          href="#planes"
          className="btn-primary"
          style={{
            fontSize: "clamp(1.05rem, 2.5vw, 1.4rem)",
            padding: "1rem 3rem",
            letterSpacing: "0.12em",
            boxShadow: "0 0 24px rgba(153,27,27,0.5), 0 0 48px rgba(153,27,27,0.25)",
          }}
        >
          ¡INSCRÍBETE AHORA!
        </a>

        {/* Indicador de scroll */}
        <div className="mt-14 flex flex-col items-center gap-2 opacity-50">
          <span className="text-brand-metal-light text-xs font-sans uppercase tracking-widest">
            Descubre más
          </span>
          <svg
            className="animate-bounce"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--metal-light)" }}
            aria-hidden="true"
          >
            <path d="M7 10l5 5 5-5" />
          </svg>
        </div>
      </motion.div>

      {/* ── BARRA INFERIOR DE IMPACTO ────────────────────────── */}
      <div
        className="relative z-10 w-full border-t"
        style={{ borderColor: "rgba(153,27,27,0.4)" }}
      >
        <div className="container-base py-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
          {[
            { number: "9", label: "Disciplinas" },
            { number: "+500", label: "Miembros Activos" },
            { number: "#1", label: "Gimnasio en Loja" },
          ].map(({ number, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span
                className="heading-display text-brand-red"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                }}
              >
                {number}
              </span>
              <span className="text-brand-metal-light text-xs font-sans uppercase tracking-widest">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
