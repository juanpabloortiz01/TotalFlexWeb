"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { DisciplinaCard } from "@/components/ui/color-change-card";

// ── DATOS DE LAS 9 DISCIPLINAS ────────────────────────────────
const DISCIPLINAS = [
  {
    heading: "Pesas",
    description:
      "Zona de musculación equipada con máquinas de última generación. Construye fuerza, masa muscular y resistencia.",
    imgSrc:
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
  },
  {
    heading: "Box",
    description:
      "Entrena como un campeón. Técnica de golpeo, footwork y acondicionamiento físico de alto nivel.",
    imgSrc:
      "https://images.pexels.com/photos/4428282/pexels-photo-4428282.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
  },
  {
    heading: "MMA",
    description:
      "Artes Marciales Mixtas: combina striking, lucha y grappling en un entrenamiento completo e intenso.",
    imgSrc:
      "https://images.pexels.com/photos/6765038/pexels-photo-6765038.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
  },
  {
    heading: "Jiujitsu",
    description:
      "El arte suave. Aprende técnicas de sumisión, control en el suelo y defensa personal efectiva.",
    imgSrc:
      "https://images.pexels.com/photos/8611335/pexels-photo-8611335.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
  },
  {
    heading: "Funcional",
    description:
      "Entrenamiento de alta intensidad con movimientos funcionales. Quema grasa y mejora tu rendimiento global.",
    imgSrc:
      "https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
  },
  {
    heading: "Spinning",
    description:
      "Clases de ciclismo indoor con música y ritmo explosivo. Cardio de alto rendimiento para todos los niveles.",
    imgSrc:
      "https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
  },
  {
    heading: "Calistenia",
    description:
      "Domina tu propio peso corporal. Fuerza, control y movimiento atlético sin necesidad de equipos.",
    imgSrc:
      "https://images.pexels.com/photos/3289711/pexels-photo-3289711.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
  },
  {
    heading: "Pilates",
    description:
      "Fortalece el core, mejora la postura y gana flexibilidad. Disciplina mente-cuerpo con resultados reales.",
    imgSrc:
      "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
  },
  {
    heading: "Bailoterapia",
    description:
      "Quema calorías bailando. Clases dinámicas y divertidas que combinan cardio, ritmo y bienestar.",
    imgSrc:
      "https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
  },
];

// ── HELPER: Dividir array en grupos ──────────────────────────
function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

const SLIDES = chunkArray(DISCIPLINAS, 4);
// → [[Pesas, Box, MMA, Jiujitsu], [Funcional, Spinning, Calistenia, Pilates], [Bailoterapia]]

// ── VARIANTES DE ANIMACIÓN ────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "60%" : "-60%",
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-60%" : "60%",
    opacity: 0,
    scale: 0.97,
  }),
};

// ── SECCIÓN DISCIPLINAS CON CAROUSEL ─────────────────────────
export default function Disciplines() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (current < SLIDES.length - 1) {
      setDirection(1);
      setCurrent((s) => s + 1);
    }
  };

  const goPrev = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent((s) => s - 1);
    }
  };

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  return (
    <section
      id="disciplinas"
      className="w-full"
      style={{ backgroundColor: "#09090B" }}
    >
      {/* ── ENCABEZADO ──────────────────────────────────────── */}
      <motion.div
        className="container-base pt-20 pb-12 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <p className="section-eyebrow tracking-widest mb-4">
          9 Áreas Especializadas
        </p>
        <h2
          className="heading-display text-brand-white mb-4"
          style={{
            fontSize: "clamp(3rem, 7vw, 5.5rem)",
            lineHeight: 1,
            letterSpacing: "0.04em",
          }}
        >
          ELIGE TU{" "}
          <span style={{ color: "#DC2626" }}>ENTRENAMIENTO</span>
        </h2>
        <p
          className="mx-auto max-w-xl"
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "1rem",
            color: "#A1A1AA",
            lineHeight: 1.6,
          }}
        >
          Cada disciplina está guiada por entrenadores certificados.
          Encuentra tu pasión y empieza hoy.
        </p>
        <div
          className="mx-auto mt-8 h-px w-16"
          style={{
            backgroundColor: "#991B1B",
            boxShadow: "0 0 10px rgba(153,27,27,0.6)",
          }}
          aria-hidden="true"
        />
      </motion.div>

      {/* ── CAROUSEL ────────────────────────────────────────── */}
      <motion.div
        className="relative w-full flex items-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
      >

        {/* Flecha Izquierda */}
        <button
          id="disciplines-prev"
          onClick={goPrev}
          aria-label="Disciplinas anteriores"
          disabled={current === 0}
          className="shrink-0 z-20 flex items-center justify-center transition-all duration-200"
          style={{
            width: "clamp(2.5rem, 4vw, 3.5rem)",
            height: "clamp(2.5rem, 4vw, 3.5rem)",
            marginLeft: "clamp(0.5rem, 2vw, 2rem)",
            borderRadius: 0,
            backgroundColor: current === 0 ? "#1C1C1F" : "#991B1B",
            border: `2px solid ${current === 0 ? "#27272A" : "#991B1B"}`,
            color: current === 0 ? "#52525B" : "#FAFAFA",
            cursor: current === 0 ? "not-allowed" : "pointer",
            opacity: current === 0 ? 0.4 : 1,
          }}
        >
          <FiChevronLeft size={22} />
        </button>

        {/* Contenedor del slide con overflow hidden */}
        <div className="flex-1 overflow-hidden px-3 md:px-6">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="grid gap-4 md:gap-5"
              style={{
                gridTemplateColumns:
                  SLIDES[current].length === 1
                    ? "1fr"
                    : "repeat(auto-fit, minmax(260px, 1fr))",
              }}
            >
              {SLIDES[current].map((disc) => (
                <div
                  key={disc.heading}
                  className={
                    SLIDES[current].length === 1
                      ? "max-w-2xl mx-auto w-full"
                      : ""
                  }
                >
                  <DisciplinaCard
                    heading={disc.heading}
                    description={disc.description}
                    imgSrc={disc.imgSrc}
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Flecha Derecha */}
        <button
          id="disciplines-next"
          onClick={goNext}
          aria-label="Disciplinas siguientes"
          disabled={current === SLIDES.length - 1}
          className="shrink-0 z-20 flex items-center justify-center transition-all duration-200"
          style={{
            width: "clamp(2.5rem, 4vw, 3.5rem)",
            height: "clamp(2.5rem, 4vw, 3.5rem)",
            marginRight: "clamp(0.5rem, 2vw, 2rem)",
            borderRadius: 0,
            backgroundColor:
              current === SLIDES.length - 1 ? "#1C1C1F" : "#991B1B",
            border: `2px solid ${
              current === SLIDES.length - 1 ? "#27272A" : "#991B1B"
            }`,
            color:
              current === SLIDES.length - 1 ? "#52525B" : "#FAFAFA",
            cursor:
              current === SLIDES.length - 1 ? "not-allowed" : "pointer",
            opacity: current === SLIDES.length - 1 ? 0.4 : 1,
          }}
        >
          <FiChevronRight size={22} />
        </button>
      </motion.div>

      {/* ── DOTS ────────────────────────────────────────────── */}
      <div className="flex justify-center gap-2 pt-8 pb-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            id={`disciplines-dot-${i}`}
            onClick={() => goTo(i)}
            aria-label={`Ir a sección ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width: i === current ? "2rem" : "0.5rem",
              height: "0.375rem",
              borderRadius: 0,
              backgroundColor: i === current ? "#DC2626" : "#3F3F46",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>

    </section>

  );
}
