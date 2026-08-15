"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiArrowRight, FiArrowLeft, FiCheck, FiLoader, FiUser, FiCalendar, FiPhone, FiInfo, FiActivity, FiClock, FiBriefcase } from "react-icons/fi";

// ── TIPOS ─────────────────────────────────────────────────────
interface EnrollmentModalProps {
  isOpen: boolean;
  plan: string;
  onClose: () => void;
}

interface FormData {
  cedula: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: string;
  disciplina: string;
  horario: string;
  ocupacion: string;
  comentarios: string;
  aceptaPoliticas: boolean;
}

const DISCIPLINAS = [
  "Pesas", "Box", "MMA", "Jiujitsu",
  "Funcional", "Spinning", "Calistenia", "Pilates", "Bailoterapia",
];

const HORARIOS = [
  { value: "Mañana", label: "Mañana", sub: "06:00 – 12:00" },
  { value: "Tarde", label: "Tarde", sub: "12:00 – 18:00" },
  { value: "Noche", label: "Noche", sub: "18:00 – 22:00" },
];

const OCUPACIONES = ["Estudiante", "Jubilado", "Empleado", "Emprendedor"];

const TOTAL_STEPS = 6;

// ── VARIANTES DE ANIMACIÓN ────────────────────────────────────
const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────
export default function EnrollmentModal({ isOpen, plan, onClose }: EnrollmentModalProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    cedula: "", nombre: "", apellido: "", fechaNacimiento: "",
    telefono: "", disciplina: "", horario: "",
    ocupacion: "", comentarios: "", aceptaPoliticas: false,
  });

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const canNext = () => {
    if (step === 1) return form.cedula.trim().length === 10;
    if (step === 2) return form.nombre.trim() && form.apellido.trim() && form.fechaNacimiento;
    if (step === 3) return form.telefono.trim().length >= 9;
    if (step === 4) return !!form.disciplina;
    if (step === 5) return !!form.horario && !!form.ocupacion;
    if (step === 6) return form.aceptaPoliticas;
    return false;
  };

  const goNext = async () => {
    if (step === 1) {
      setIsLoading(true);
      setApiError(null);
      try {
        const res = await fetch(`/api/miembros/check?cedula=${form.cedula}`);
        if (res.ok) {
          const result = await res.json();
          if (result.exists && result.data) {
            const d = result.data;
            const partes = (d.nombre || "").trim().split(" ");
            const apellido = partes.length > 1 ? partes.pop() || "" : "";
            const nombre = partes.join(" ") || d.nombre;

            let tel = d.telefono || "";
            if (tel.startsWith("+593")) tel = tel.slice(4);
            else if (tel.startsWith("593")) tel = tel.slice(3);

            setForm(f => ({
              ...f,
              nombre,
              apellido,
              fechaNacimiento: d.fecha_nacimiento ? new Date(d.fecha_nacimiento).toISOString().split("T")[0] : "",
              telefono: tel,
              disciplina: d.disciplina || "",
              horario: d.horario_preferido || "",
              ocupacion: d.ocupacion || "",
            }));
          }
        }
      } catch (err) {
        console.error("Error al verificar cédula:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (step < TOTAL_STEPS) { setDirection(1); setStep((s) => s + 1); }
    else handleSubmit();
  };

  const goPrev = () => {
    if (step > 1) { setDirection(-1); setStep((s) => s - 1); }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await fetch("/api/inscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error ?? "Error al enviar la solicitud. Intenta de nuevo.");
        return;
      }
      setSubmitted(true);
    } catch {
      setApiError("Sin conexión. Verifica tu internet e intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setStep(1); setSubmitted(false); setApiError(null); setForm({
      cedula: "", nombre: "", apellido: "", fechaNacimiento: "", telefono: "",
      disciplina: "", horario: "", ocupacion: "", comentarios: "", aceptaPoliticas: false,
    }); }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* ── OVERLAY ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        {/* ── MODAL CONTAINER ──────────────────────────────── */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-lg flex flex-col overflow-hidden"
            style={{ backgroundColor: "#111113", border: "1px solid #27272A", borderRadius: "16px", maxHeight: "90vh" }}
          >
          {/* Barra de progreso superior */}
          <div className="h-1 w-full shrink-0" style={{ backgroundColor: "#1C1C1F" }}>
            <motion.div
              className="h-full"
              style={{ backgroundColor: "#DC2626" }}
              initial={{ width: 0 }}
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>

          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 flex items-center justify-center transition-colors duration-150"
            style={{ color: "#52525B", width: 28, height: 28 }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FAFAFA")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#52525B")}
            aria-label="Cerrar"
          >
            <FiX size={20} />
          </button>

          <div className="p-6 overflow-y-auto">
            {!submitted && (
              <div className="text-center mb-2">
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem",
                  fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                  color: "#DC2626", marginBottom: "0.25rem" }}>
                  PASO {step} DE {TOTAL_STEPS}
                </p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem",
                  fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "#52525B" }}>
                  Plan {plan} seleccionado
                </p>
              </div>
            )}

            {/* ── ÉXITO ──────────────────────────────────────── */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <div className="mx-auto mb-6 flex items-center justify-center"
                  style={{ width: 64, height: 64, backgroundColor: "rgba(153,27,27,0.15)",
                    border: "2px solid #991B1B", borderRadius: "16px" }}>
                  <FiCheck size={28} style={{ color: "#DC2626" }} />
                </div>
                <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "2.5rem",
                  letterSpacing: "0.06em", color: "#FAFAFA", marginBottom: "0.75rem" }}>
                  ¡SOLICITUD ENVIADA!
                </h3>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem",
                  color: "#A1A1AA", lineHeight: 1.6 }}>
                  Nos pondremos en contacto contigo pronto para confirmar tu inscripción en TotalFlexGym.
                </p>
                <button onClick={handleClose} className="btn-primary mt-8"
                  style={{ fontSize: "1rem", padding: "0.75rem 2rem", letterSpacing: "0.1em", borderRadius: "12px" }}>
                  CERRAR
                </button>
              </motion.div>
            ) : (
              <>
                {/* ── CONTENIDO DEL PASO ───────────────────────── */}
                <div className="overflow-hidden" style={{ minHeight: 220 }}>
                  <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {step === 1 && <StepCedula form={form} set={set} />}
                      {step === 2 && <Step1 form={form} set={set} />}
                      {step === 3 && <Step2 form={form} set={set} />}
                      {step === 4 && <Step3 form={form} set={set} />}
                      {step === 5 && <Step4 form={form} set={set} />}
                      {step === 6 && <Step5 form={form} set={set} />}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* ── MENSAJE DE ERROR API ──────────────────────── */}
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 px-4 py-3"
                    style={{ backgroundColor: "rgba(153,27,27,0.15)",
                      border: "1px solid #991B1B" }}
                  >
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem",
                      color: "#FCA5A5", lineHeight: 1.5 }}>
                      {apiError}
                    </p>
                  </motion.div>
                )}

                {/* ── NAVEGACIÓN ───────────────────────────────── */}
                <div className="mt-4">
                  <button
                    onClick={goNext}
                    disabled={!canNext() || isLoading}
                    className="w-full flex items-center justify-center gap-2 transition-all duration-150"
                    style={{ fontFamily: "var(--font-bebas)", fontSize: "1rem",
                      letterSpacing: "0.12em", padding: "0.75rem",
                      backgroundColor: canNext() && !isLoading ? "#991B1B" : "#1C1C1F",
                      color: canNext() && !isLoading ? "#FAFAFA" : "#3F3F46",
                      border: `2px solid ${canNext() && !isLoading ? "#991B1B" : "#27272A"}`,
                      borderRadius: "12px",
                      cursor: canNext() && !isLoading ? "pointer" : "not-allowed" }}>
                    {isLoading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          style={{ display: "inline-flex" }}
                        >
                          <FiLoader size={14} />
                        </motion.span>
                        ENVIANDO…
                      </>
                    ) : (
                      <>{step === TOTAL_STEPS ? "CONFIRMAR" : "SIGUIENTE"} <FiArrowRight size={14} /></>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

// ── ESTILOS COMPARTIDOS ───────────────────────────────────────
const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600,
  letterSpacing: "0.05em", color: "#A1A1AA",
  display: "block", marginBottom: "0.5rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "transparent", border: "none",
  color: "#FAFAFA", fontFamily: "var(--font-inter)", fontSize: "1rem",
  outline: "none",
};

const cardWrapperStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "1rem",
  width: "100%", padding: "0.85rem 1rem",
  backgroundColor: "#09090B", border: "1px solid #27272A",
  borderRadius: "16px", transition: "all 200ms ease",
};

// ── PASO 1: Nombre + Fecha ────────────────────────────────────
function Step1({ form, set }: { form: FormData; set: (f: keyof FormData, v: string | boolean) => void }) {
  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "2rem",
        letterSpacing: "0.06em", color: "#FAFAFA", marginBottom: "1.5rem", textAlign: "center" }}>
        CUÉNTANOS SOBRE TI
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label style={labelStyle}>Nombre</label>
          <div style={cardWrapperStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#DC2626")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#27272A")}>
            <FiUser size={20} color="#71717A" />
            <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)}
              placeholder="Juan" style={inputStyle} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Apellido</label>
          <div style={cardWrapperStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#DC2626")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#27272A")}>
            <FiUser size={20} color="#71717A" />
            <input value={form.apellido} onChange={(e) => set("apellido", e.target.value)}
              placeholder="Pérez" style={inputStyle} />
          </div>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Fecha de Nacimiento</label>
        <div style={cardWrapperStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#DC2626")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#27272A")}>
          <FiCalendar size={20} color="#71717A" />
          <input type="date" value={form.fechaNacimiento}
            onChange={(e) => set("fechaNacimiento", e.target.value)} style={inputStyle} />
        </div>
      </div>
    </div>
  );
}

// ── PASO 2: Teléfono ──────────────────────────────────────────
function Step2({ form, set }: { form: FormData; set: (f: keyof FormData, v: string | boolean) => void }) {
  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "2rem",
        letterSpacing: "0.06em", color: "#FAFAFA", marginBottom: "0.5rem", textAlign: "center" }}>
        TU NÚMERO DE CONTACTO
      </h3>
      <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem",
        color: "#71717A", marginBottom: "1.5rem", textAlign: "center" }}>
        Te contactaremos por WhatsApp para confirmar tu inscripción.
      </p>
      <label style={labelStyle}>Número de Teléfono / WhatsApp</label>
      <div style={cardWrapperStyle}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#DC2626")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#27272A")}>
        <FiPhone size={20} color="#71717A" />
        <span style={{ color: "#71717A", fontFamily: "var(--font-inter)", fontSize: "1rem", whiteSpace: "nowrap" }}>
          🇪🇨 +593
        </span>
        <input type="tel" value={form.telefono}
          onChange={(e) => set("telefono", e.target.value.replace(/\D/g, "").slice(0, 10))}
          placeholder="09X XXX XXXX"
          style={inputStyle} />
      </div>
    </div>
  );
}

// ── PASO 3: Disciplina ────────────────────────────────────────
function Step3({ form, set }: { form: FormData; set: (f: keyof FormData, v: string | boolean) => void }) {
  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "2rem",
        letterSpacing: "0.06em", color: "#FAFAFA", marginBottom: "0.5rem", textAlign: "center" }}>
        ¿QUÉ DISCIPLINA TE INTERESA?
      </h3>
      <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem",
        color: "#71717A", marginBottom: "1.25rem", textAlign: "center" }}>
        Puedes cambiar o añadir más disciplinas una vez inscrito.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DISCIPLINAS.map((d) => (
          <button key={d} onClick={() => set("disciplina", d)}
            className="flex items-center justify-between text-left"
            style={{ ...cardWrapperStyle,
              border: `1px solid ${form.disciplina === d ? "#DC2626" : "#27272A"}`,
              backgroundColor: form.disciplina === d ? "rgba(220,38,38,0.05)" : "#09090B",
              cursor: "pointer" }}>
            <div className="flex items-center gap-4">
              <FiActivity size={20} color={form.disciplina === d ? "#DC2626" : "#71717A"} />
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", fontWeight: 600, color: form.disciplina === d ? "#FAFAFA" : "#A1A1AA" }}>{d}</span>
            </div>
            <div style={{
              width: "20px", height: "20px", borderRadius: "50%",
              border: `1px solid ${form.disciplina === d ? "#DC2626" : "#3F3F46"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: form.disciplina === d ? "#DC2626" : "transparent"
            }}>
              {form.disciplina === d && <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#09090B" }} />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── PASO 4: Horario + Ocupación ───────────────────────────────
function Step4({ form, set }: { form: FormData; set: (f: keyof FormData, v: string | boolean) => void }) {
  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "2rem",
        letterSpacing: "0.06em", color: "#FAFAFA", marginBottom: "1.25rem", textAlign: "center" }}>
        HORARIO Y PERFIL
      </h3>

      <label style={{ ...labelStyle, marginBottom: "0.6rem" }}>Horario preferido</label>
      <div className="grid grid-cols-1 gap-4 mb-6">
        {HORARIOS.map((h) => (
          <button key={h.value} onClick={() => set("horario", h.value)}
            className="flex items-center justify-between text-left"
            style={{ ...cardWrapperStyle,
              border: `1px solid ${form.horario === h.value ? "#DC2626" : "#27272A"}`,
              backgroundColor: form.horario === h.value ? "rgba(220,38,38,0.05)" : "#09090B",
              cursor: "pointer" }}>
            <div className="flex items-center gap-4">
              <FiClock size={20} color={form.horario === h.value ? "#DC2626" : "#71717A"} />
              <div>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "1rem",
                  fontWeight: 600, color: form.horario === h.value ? "#FAFAFA" : "#A1A1AA",
                  display: "block" }}>{h.label}</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.85rem",
                  color: form.horario === h.value ? "rgba(255,255,255,0.7)" : "#71717A" }}>
                  {h.sub}
                </span>
              </div>
            </div>
            <div style={{
              width: "20px", height: "20px", borderRadius: "50%",
              border: `1px solid ${form.horario === h.value ? "#DC2626" : "#3F3F46"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: form.horario === h.value ? "#DC2626" : "transparent"
            }}>
              {form.horario === h.value && <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#09090B" }} />}
            </div>
          </button>
        ))}
      </div>

      <label style={{ ...labelStyle, marginBottom: "0.6rem" }}>Ocupación</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OCUPACIONES.map((o) => (
          <button key={o} onClick={() => set("ocupacion", o)}
            className="flex items-center justify-between text-left"
            style={{ ...cardWrapperStyle,
              border: `1px solid ${form.ocupacion === o ? "#DC2626" : "#27272A"}`,
              backgroundColor: form.ocupacion === o ? "rgba(220,38,38,0.05)" : "#09090B",
              cursor: "pointer" }}>
            <div className="flex items-center gap-4">
              <FiBriefcase size={20} color={form.ocupacion === o ? "#DC2626" : "#71717A"} />
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", fontWeight: 600, color: form.ocupacion === o ? "#FAFAFA" : "#A1A1AA" }}>{o}</span>
            </div>
            <div style={{
              width: "20px", height: "20px", borderRadius: "50%",
              border: `1px solid ${form.ocupacion === o ? "#DC2626" : "#3F3F46"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: form.ocupacion === o ? "#DC2626" : "transparent"
            }}>
              {form.ocupacion === o && <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#09090B" }} />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── PASO 5: Comentarios + Políticas ──────────────────────────
function Step5({ form, set }: {
  form: FormData;
  set: (f: keyof FormData, v: string | boolean) => void;
}) {
  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "2rem",
        letterSpacing: "0.06em", color: "#FAFAFA", marginBottom: "0.5rem", textAlign: "center" }}>
        ÚLTIMO PASO
      </h3>
      <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem",
        color: "#71717A", marginBottom: "1.25rem", textAlign: "center" }}>
        Opcional: comparte algo más que debamos saber.
      </p>

      <div style={{ ...cardWrapperStyle, alignItems: "flex-start" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#DC2626")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#27272A")}>
        <FiInfo size={20} color="#71717A" style={{ marginTop: "2px" }} />
        <textarea value={form.comentarios}
          onChange={(e) => set("comentarios", e.target.value)}
          placeholder="Ej: tengo una lesión de rodilla, prefiero clases de nivel básico..."
          rows={3}
          style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }} />
      </div>

      {/* Checkbox de políticas */}
      <label className="flex items-start gap-3 mt-5 cursor-pointer group">
        <div onClick={() => set("aceptaPoliticas", !form.aceptaPoliticas)}
          className="shrink-0 flex items-center justify-center transition-all duration-200 mt-0.5"
          style={{ width: 20, height: 20, borderRadius: "6px",
            backgroundColor: form.aceptaPoliticas ? "#DC2626" : "#09090B",
            border: `1px solid ${form.aceptaPoliticas ? "#DC2626" : "#3F3F46"}`,
            cursor: "pointer" }}>
          {form.aceptaPoliticas && <FiCheck size={14} style={{ color: "#FAFAFA" }} />}
        </div>
        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.78rem",
          color: "#71717A", lineHeight: 1.55 }}>
          He leído y acepto las{" "}
          <span style={{ color: "#DC2626", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "2px", fontSize: "0.78rem" }}>
            Políticas de Privacidad
          </span>{" "}
          y el tratamiento de mis datos personales conforme a la LOPDP Ecuador.
        </span>
      </label>
    </div>
  );
}

// ── PASO CÉDULA: Número de Cédula (Paso 1) ───────────────────
function StepCedula({ form, set }: { form: FormData; set: (f: keyof FormData, v: string | boolean) => void }) {
  const isValid = form.cedula.trim().length === 10;
  const hasInput = form.cedula.trim().length > 0;

  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-bebas)", fontSize: "2rem",
        letterSpacing: "0.06em", color: "#FAFAFA", marginBottom: "0.5rem", textAlign: "center" }}>
        IDENTIFÍCATE
      </h3>
      <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem",
        color: "#71717A", marginBottom: "1.75rem", textAlign: "center" }}>
        Tu cédula nos permite registrar tu membresía de forma segura.
      </p>

      <label style={labelStyle}>Número de Cédula</label>
      <div style={{ ...cardWrapperStyle, borderColor: hasInput ? (isValid ? "#16A34A" : "#DC2626") : "#27272A" }}
        onFocus={(e) => { if (!isValid) e.currentTarget.style.borderColor = "#DC2626"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = hasInput ? (isValid ? "#16A34A" : "#DC2626") : "#27272A"; }}>
        <FiUser size={24} color={hasInput ? (isValid ? "#16A34A" : "#DC2626") : "#71717A"} />
        <input
          type="text"
          inputMode="numeric"
          value={form.cedula}
          onChange={(e) => set("cedula", e.target.value.replace(/\D/g, "").slice(0, 10))}
          placeholder="0000000000"
          maxLength={10}
          style={{ ...inputStyle, letterSpacing: "0.2em", fontSize: "1.25rem" }}
        />
      </div>

      {/* Indicador de progreso de dígitos */}
      <div className="flex items-center gap-2 mt-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-0.5 transition-all duration-150"
            style={{
              backgroundColor: i < form.cedula.trim().length
                ? (isValid ? "#16A34A" : "#991B1B")
                : "#27272A",
            }}
          />
        ))}
      </div>
      <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem",
        color: isValid ? "#4ADE80" : hasInput ? "#FCA5A5" : "#3F3F46",
        marginTop: "0.5rem", transition: "color 150ms" }}>
        {isValid
          ? "✓ Cédula válida"
          : hasInput
          ? `${form.cedula.trim().length}/10 dígitos`
          : "10 dígitos · Solo números"}
      </p>
    </div>
  );
}
