"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

// ── COLOR-CHANGE CARD — Adaptado a TotalFlexGym ───────────────
// Efecto: desaturado en reposo → color en hover (solo Desktop)
// Paleta: dark (#09090B), rojo (#DC2626), blanco (#FAFAFA)

export interface DisciplinaCardProps {
  heading: string;
  description: string;
  imgSrc: string;
}

export const DisciplinaCard = ({
  heading,
  description,
  imgSrc,
}: DisciplinaCardProps) => {
  return (
    <motion.div
      transition={{ staggerChildren: 0.035 }}
      whileHover="hover"
      className="group relative h-72 w-full cursor-pointer overflow-hidden"
      style={{ backgroundColor: "#111113" }}
    >
      {/* Imagen de fondo — desaturada en reposo, a color en hover */}
      <div
        className="absolute inset-0 transition-all duration-500 group-hover:scale-110 md:saturate-0 md:group-hover:saturate-100"
        style={{
          backgroundImage: `url(${imgSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay degradado — más intenso en hover para que el texto sea legible */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(to top, rgba(9,9,11,0.92) 0%, rgba(9,9,11,0.5) 50%, rgba(9,9,11,0.2) 100%)",
        }}
      />

      {/* Borde rojo sutil en hover */}
      <div
        className="absolute inset-0 border-2 border-transparent transition-colors duration-500 group-hover:border-red-600"
        style={{ borderColor: "transparent" }}
      />

      {/* Contenido */}
      <div className="relative z-20 flex h-full flex-col justify-between p-5 text-white">
        {/* Flecha superior derecha */}
        <FiArrowRight
          className="ml-auto text-2xl transition-all duration-500 group-hover:-rotate-45"
          style={{ color: "#DC2626" }}
        />

        {/* Texto inferior */}
        <div>
          {/* Heading animado letra por letra */}
          <h3
            className="mb-2 uppercase"
            style={{
              fontFamily: "var(--font-bebas), 'Bebas Neue', Impact, sans-serif",
              fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
              letterSpacing: "0.08em",
              lineHeight: 1,
              color: "#FAFAFA",
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            {heading.split("").map((letter, index) => (
              <AnimatedLetter letter={letter} key={index} />
            ))}
          </h3>

          {/* Descripción */}
          <p
            className="text-sm leading-snug"
            style={{
              fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
              color: "#A1A1AA",
              maxWidth: "28ch",
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ── AnimatedLetter — efecto slide vertical en hover ───────────
interface AnimatedLetterProps {
  letter: string;
}

const letterVariants: Variants = {
  hover: { y: "-50%" },
};

const AnimatedLetter = ({ letter }: AnimatedLetterProps) => {
  return (
    <div
      className="inline-block overflow-hidden"
      style={{ height: "1.15em", verticalAlign: "bottom" }}
    >
      <motion.span
        className="flex min-w-[4px] flex-col"
        style={{ y: "0%" }}
        variants={letterVariants}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <span>{letter}</span>
        <span style={{ color: "#DC2626" }}>{letter}</span>
      </motion.span>
    </div>
  );
};

export default DisciplinaCard;
