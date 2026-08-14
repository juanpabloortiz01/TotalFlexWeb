"use client";

import { useState } from "react";
import { SquishyPricing } from "@/components/ui/squishy-pricing";
import EnrollmentModal from "@/components/ui/enrollment-modal";

// ── SECCIÓN PRECIOS ───────────────────────────────────────────
export default function Pricing() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const handleEnroll = (plan: string) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  return (
    <>
      <section
        id="planes"
        className="w-full"
        style={{ backgroundColor: "#09090B" }}
      >
        {/* Separador superior */}
        <div className="w-full h-px" style={{ backgroundColor: "#27272A" }} aria-hidden="true" />

        {/* ── ENCABEZADO MÍNIMO ────────────────────────────────── */}
        <div className="container-base pt-20 pb-14 text-center">
          <p className="section-eyebrow tracking-widest mb-4">Membresías</p>
          <h2
            className="heading-display text-brand-white"
            style={{
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              lineHeight: 1,
              letterSpacing: "0.04em",
            }}
          >
            ELIGE TU <span style={{ color: "#DC2626" }}>PLAN</span>
          </h2>
        </div>

        {/* ── TARJETAS ─────────────────────────────────────────── */}
        <div className="pb-20">
          <SquishyPricing onEnroll={handleEnroll} />
        </div>

        {/* Separador inferior */}
        <div className="w-full h-px" style={{ backgroundColor: "#27272A" }} aria-hidden="true" />
      </section>

      {/* ── MODAL DE INSCRIPCIÓN ──────────────────────────────── */}
      <EnrollmentModal
        isOpen={modalOpen}
        plan={selectedPlan}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
