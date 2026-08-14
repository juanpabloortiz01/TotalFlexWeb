"use client";

import { motion } from "framer-motion";

// ── TIPOS ─────────────────────────────────────────────────────
interface PricingCardProps {
  label: string;
  price: string;
  period: string;
  description: string;
  cta: string;
  featured?: boolean;
  background: string;
  BGComponent: React.FC;
  onEnroll: (plan: string) => void;
}

interface SquishyPricingProps {
  onEnroll: (plan: string) => void;
}

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────
export const SquishyPricing = ({ onEnroll }: SquishyPricingProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-6 px-4">
      <PricingCard
        label="Mensual"
        price="35"
        period="mes"
        description="Acceso completo a todas las disciplinas. Sin permanencia."
        cta="Inscríbete"
        background="#18181B"
        BGComponent={BGCircles}
        onEnroll={onEnroll}
      />
      <PricingCard
        label="Trimestral"
        price="90"
        period="3 meses"
        description="Ahorra 15$ frente al plan mensual. Ideal para resultados reales."
        cta="Inscríbete"
        featured={true}
        background="#7F1D1D"
        BGComponent={BGRects}
        onEnroll={onEnroll}
      />
      <PricingCard
        label="Semestral"
        price="200"
        period="6 meses"
        description="Seis meses de acceso total. Compromiso a medio plazo con ahorro real."
        cta="Inscríbete"
        background="#1C1C1F"
        BGComponent={BGLines}
        onEnroll={onEnroll}
      />
      <PricingCard
        label="Anual"
        price="320"
        period="año"
        description="El mejor valor. 12 meses de entrenamiento sin límites ni sorpresas."
        cta="Inscríbete"
        background="#09090B"
        BGComponent={BGDiamonds}
        onEnroll={onEnroll}
      />
    </div>
  );
};

// ── TARJETA DE PRECIO ─────────────────────────────────────────
const PricingCard = ({
  label,
  price,
  period,
  description,
  cta,
  featured = false,
  background,
  BGComponent,
  onEnroll,
}: PricingCardProps) => {
  return (
    <motion.div
      whileHover="hover"
      transition={{ duration: 0.9, ease: "backInOut" }}
      variants={{ hover: { scale: 1.05, y: -4 } }}
      className="relative h-96 w-80 shrink-0 overflow-hidden"
      style={{
        backgroundColor: background,
        border: featured ? "2px solid #DC2626" : "1px solid #27272A",
        boxShadow: featured
          ? "0 0 32px rgba(153,27,27,0.35), 0 0 64px rgba(153,27,27,0.15)"
          : "0 4px 24px rgba(0,0,0,0.6)",
      }}
    >
      {/* Contenido */}
      <div className="relative z-10 p-7 text-white h-full flex flex-col justify-between">
        <div>
          {/* Badge de plan */}
          <div className="flex items-center gap-2 mb-4">
            <span
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: featured ? "#FAFAFA" : "#A1A1AA",
                backgroundColor: featured
                  ? "rgba(220,38,38,0.25)"
                  : "rgba(255,255,255,0.06)",
                border: featured ? "1px solid rgba(220,38,38,0.5)" : "1px solid #27272A",
                padding: "0.25rem 0.75rem",
              }}
            >
              {label}
            </span>
            {featured && (
              <span
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#DC2626",
                  backgroundColor: "rgba(220,38,38,0.12)",
                  border: "1px solid rgba(220,38,38,0.3)",
                  padding: "0.25rem 0.6rem",
                }}
              >
                ★ Popular
              </span>
            )}
          </div>

          {/* Precio */}
          <motion.div
            initial={{ scale: 0.88 }}
            variants={{ hover: { scale: 1 } }}
            transition={{ duration: 0.9, ease: "backInOut" }}
            className="origin-top-left mb-3"
          >
            <span
              style={{
                fontFamily:
                  "var(--font-bebas), 'Bebas Neue', Impact, sans-serif",
                fontSize: "5rem",
                lineHeight: 1,
                color: "#FAFAFA",
                display: "block",
              }}
            >
              ${price}
            </span>
            <span
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: "0.8rem",
                color: featured ? "rgba(255,255,255,0.6)" : "#52525B",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              / {period}
            </span>
          </motion.div>

          {/* Descripción */}
          <p
            style={{
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontSize: "0.875rem",
              lineHeight: 1.55,
              color: featured ? "rgba(255,255,255,0.75)" : "#71717A",
            }}
          >
            {description}
          </p>
        </div>

        {/* Botón CTA */}
        <button
          onClick={() => onEnroll(label)}
          className="w-full py-3 text-center transition-all duration-200 focus:outline-none"
          style={{
            fontFamily:
              "var(--font-bebas), 'Bebas Neue', Impact, sans-serif",
            fontSize: "1.1rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            backgroundColor: featured ? "#FAFAFA" : "transparent",
            color: featured ? "#09090B" : "#FAFAFA",
            border: featured ? "2px solid #FAFAFA" : "2px solid #3F3F46",
          }}
          onMouseEnter={(e) => {
            if (featured) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#FAFAFA";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "#FAFAFA";
            } else {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "#DC2626";
              (e.currentTarget as HTMLButtonElement).style.color = "#DC2626";
            }
          }}
          onMouseLeave={(e) => {
            if (featured) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#FAFAFA";
              (e.currentTarget as HTMLButtonElement).style.color = "#09090B";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "#FAFAFA";
            } else {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "#3F3F46";
              (e.currentTarget as HTMLButtonElement).style.color = "#FAFAFA";
            }
          }}
        >
          {cta}
        </button>
      </div>

      {/* Fondo animado */}
      <BGComponent />
    </motion.div>
  );
};

// ── FONDO 1: Círculos (Mensual) ───────────────────────────────
const BGCircles = () => (
  <motion.svg
    width="320"
    height="384"
    viewBox="0 0 320 384"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    variants={{ hover: { scale: 1.5 } }}
    transition={{ duration: 0.9, ease: "backInOut" }}
    className="absolute inset-0 z-0 pointer-events-none"
  >
    <motion.circle
      variants={{ hover: { scaleY: 0.5, y: -25 } }}
      transition={{ duration: 0.9, ease: "backInOut", delay: 0.2 }}
      cx="160.5"
      cy="114.5"
      r="101.5"
      fill="rgba(255,255,255,0.04)"
    />
    <motion.ellipse
      variants={{ hover: { scaleY: 2.25, y: -25 } }}
      transition={{ duration: 0.9, ease: "backInOut", delay: 0.2 }}
      cx="160.5"
      cy="265.5"
      rx="101.5"
      ry="43.5"
      fill="rgba(255,255,255,0.04)"
    />
  </motion.svg>
);

// ── FONDO 2: Rectángulos (Trimestral — Featured) ──────────────
const BGRects = () => (
  <motion.svg
    width="320"
    height="384"
    viewBox="0 0 320 384"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    variants={{ hover: { scale: 1.05 } }}
    transition={{ duration: 0.9, ease: "backInOut" }}
    className="absolute inset-0 z-0 pointer-events-none"
  >
    <motion.rect
      x="14"
      width="153"
      height="153"
      rx="0"
      fill="rgba(0,0,0,0.2)"
      variants={{ hover: { y: 219, rotate: "90deg", scaleX: 2 } }}
      style={{ y: 12 }}
      transition={{ delay: 0.2, duration: 0.9, ease: "backInOut" }}
    />
    <motion.rect
      x="155"
      width="153"
      height="153"
      rx="0"
      fill="rgba(0,0,0,0.2)"
      variants={{ hover: { y: 12, rotate: "90deg", scaleX: 2 } }}
      style={{ y: 219 }}
      transition={{ delay: 0.2, duration: 0.9, ease: "backInOut" }}
    />
  </motion.svg>
);

// ── FONDO 3: Líneas diagonales (Semestral) ────────────────────
const BGLines = () => (
  <motion.svg
    width="320"
    height="384"
    viewBox="0 0 320 384"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    variants={{ hover: { scale: 1.15, rotate: 8 } }}
    transition={{ duration: 0.9, ease: "backInOut" }}
    className="absolute inset-0 z-0 pointer-events-none"
  >
    {[0, 60, 120, 180, 240, 300, 360].map((offset, i) => (
      <motion.line
        key={i}
        x1={-40 + offset}
        y1="0"
        x2={offset + 80}
        y2="384"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="40"
        variants={{ hover: { x1: -40 + offset - 20, x2: offset + 80 - 20 } }}
        transition={{ duration: 0.9, ease: "backInOut", delay: i * 0.05 }}
      />
    ))}
  </motion.svg>
);

// ── FONDO 4: Diamantes (Anual) ────────────────────────────────
const BGDiamonds = () => (
  <motion.svg
    width="320"
    height="384"
    viewBox="0 0 320 384"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    variants={{ hover: { scale: 1.25 } }}
    transition={{ duration: 0.9, ease: "backInOut" }}
    className="absolute inset-0 z-0 pointer-events-none"
  >
    <motion.path
      variants={{ hover: { y: -50 } }}
      transition={{ delay: 0.3, duration: 0.9, ease: "backInOut" }}
      d="M148.893 157.531C154.751 151.673 164.249 151.673 170.107 157.531L267.393 254.818C273.251 260.676 273.251 270.173 267.393 276.031L218.75 324.674C186.027 357.397 132.973 357.397 100.25 324.674L51.6068 276.031C45.7489 270.173 45.7489 260.676 51.6068 254.818L148.893 157.531Z"
      fill="rgba(153,27,27,0.25)"
    />
    <motion.path
      variants={{ hover: { y: -50 } }}
      transition={{ delay: 0.2, duration: 0.9, ease: "backInOut" }}
      d="M148.893 99.069C154.751 93.2111 164.249 93.2111 170.107 99.069L267.393 196.356C273.251 202.213 273.251 211.711 267.393 217.569L218.75 266.212C186.027 298.935 132.973 298.935 100.25 266.212L51.6068 217.569C45.7489 211.711 45.7489 202.213 51.6068 196.356L148.893 99.069Z"
      fill="rgba(153,27,27,0.18)"
    />
    <motion.path
      variants={{ hover: { y: -50 } }}
      transition={{ delay: 0.1, duration: 0.9, ease: "backInOut" }}
      d="M148.893 40.6066C154.751 34.7487 164.249 34.7487 170.107 40.6066L267.393 137.893C273.251 143.751 273.251 153.249 267.393 159.106L218.75 207.75C186.027 240.473 132.973 240.473 100.25 207.75L51.6068 159.106C45.7489 153.249 45.7489 143.751 51.6068 137.893L148.893 40.6066Z"
      fill="rgba(153,27,27,0.1)"
    />
  </motion.svg>
);

export default SquishyPricing;
