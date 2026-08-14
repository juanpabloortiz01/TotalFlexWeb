"use client";

import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";

interface PrivacyModalProps {
  onClose: () => void;
}

export default function PrivacyModal({ onClose }: PrivacyModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.9)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
        style={{ backgroundColor: "#111113", border: "1px solid #27272A" }}
      >
        {/* Barra superior */}
        <div className="h-1 w-full shrink-0" style={{ backgroundColor: "#991B1B" }} />

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 shrink-0"
          style={{ borderBottom: "1px solid #27272A" }}>
          <div>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem",
              fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
              color: "#DC2626", marginBottom: "0.4rem" }}>
              TotalFlexGym · Loja, Ecuador
            </p>
            <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "1.6rem",
              letterSpacing: "0.06em", color: "#FAFAFA", lineHeight: 1 }}>
              POLÍTICA DE PRIVACIDAD Y PROTECCIÓN DE DATOS
            </h2>
          </div>
          <button onClick={onClose} aria-label="Cerrar"
            className="shrink-0 ml-4 transition-colors duration-150"
            style={{ color: "#52525B", background: "none", border: "none", cursor: "pointer" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FAFAFA")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#52525B")}>
            <FiX size={20} />
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="overflow-y-auto flex-1 p-6" style={{ scrollbarWidth: "thin",
          scrollbarColor: "#3F3F46 #111113" }}>
          <PrivacyContent />
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4" style={{ borderTop: "1px solid #27272A" }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.72rem",
            color: "#52525B", textAlign: "center" }}>
            Vigente desde: enero 2025 · Versión 1.0 · TotalFlexGym, Loja – Ecuador
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── CONTENIDO DE LA POLÍTICA ──────────────────────────────────
function PrivacyContent() {
  const h2Style: React.CSSProperties = {
    fontFamily: "var(--font-bebas)", fontSize: "1.15rem", letterSpacing: "0.08em",
    color: "#DC2626", marginTop: "1.75rem", marginBottom: "0.6rem",
  };
  const pStyle: React.CSSProperties = {
    fontFamily: "var(--font-inter)", fontSize: "0.82rem",
    color: "#A1A1AA", lineHeight: 1.7, marginBottom: "0.75rem",
  };
  const liStyle: React.CSSProperties = {
    fontFamily: "var(--font-inter)", fontSize: "0.82rem",
    color: "#A1A1AA", lineHeight: 1.7, marginBottom: "0.3rem",
    paddingLeft: "1rem",
  };

  return (
    <div>
      <p style={{ ...pStyle, color: "#71717A", fontSize: "0.75rem" }}>
        En cumplimiento de la <strong style={{ color: "#A1A1AA" }}>Ley Orgánica de Protección de Datos Personales (LOPDP)</strong> de Ecuador, publicada en el Registro Oficial Suplemento N.° 459 del 26 de mayo de 2021, y su Reglamento, TotalFlexGym informa sobre el tratamiento de sus datos personales.
      </p>

      <h2 style={h2Style}>1. RESPONSABLE DEL TRATAMIENTO</h2>
      <p style={pStyle}>
        <strong style={{ color: "#FAFAFA" }}>TotalFlexGym</strong><br />
        Dirección: Loja, Ecuador<br />
        Correo de contacto: privacidad@totalflexgym.com.ec<br />
        Representante legal: Administración TotalFlexGym
      </p>

      <h2 style={h2Style}>2. DATOS QUE RECOPILAMOS</h2>
      <p style={pStyle}>Recopilamos únicamente los datos necesarios para gestionar su membresía:</p>
      <ul style={{ listStyle: "disc", paddingLeft: "1rem", marginBottom: "0.75rem" }}>
        {["Nombre y apellido", "Fecha de nacimiento", "Número de teléfono / WhatsApp", "Disciplina de interés", "Horario preferido y ocupación", "Comentarios adicionales opcionales"].map((item) => (
          <li key={item} style={liStyle}>{item}</li>
        ))}
      </ul>
      <p style={pStyle}>
        <strong style={{ color: "#FAFAFA" }}>No recopilamos</strong> datos de tarjetas de crédito, números de cédula ni datos sensibles sin su consentimiento expreso adicional.
      </p>

      <h2 style={h2Style}>3. FINALIDAD DEL TRATAMIENTO</h2>
      <p style={pStyle}>Sus datos se utilizan exclusivamente para:</p>
      <ul style={{ listStyle: "disc", paddingLeft: "1rem", marginBottom: "0.75rem" }}>
        {[
          "Gestionar y confirmar su inscripción como miembro.",
          "Comunicarnos con usted por WhatsApp para coordinar su acceso.",
          "Asignarle un horario y disciplina según sus preferencias.",
          "Cumplir obligaciones legales aplicables.",
        ].map((item) => (
          <li key={item} style={liStyle}>{item}</li>
        ))}
      </ul>

      <h2 style={h2Style}>4. BASE LEGAL (ART. 13 LOPDP)</h2>
      <p style={pStyle}>
        El tratamiento se basa en el <strong style={{ color: "#FAFAFA" }}>consentimiento libre, específico, informado e inequívoco</strong> del titular, conforme al Art. 13 literal a) de la LOPDP. Usted puede retirar su consentimiento en cualquier momento sin que ello afecte la licitud del tratamiento previo.
      </p>

      <h2 style={h2Style}>5. CONSERVACIÓN DE DATOS</h2>
      <p style={pStyle}>
        Sus datos se conservarán durante el tiempo que mantenga su membresía activa y por un período adicional de <strong style={{ color: "#FAFAFA" }}>2 años</strong> tras su cancelación, salvo obligación legal que exija un período distinto.
      </p>

      <h2 style={h2Style}>6. DERECHOS DEL TITULAR (ARTS. 19–26 LOPDP)</h2>
      <p style={pStyle}>Conforme a la LOPDP, usted tiene derecho a:</p>
      <ul style={{ listStyle: "disc", paddingLeft: "1rem", marginBottom: "0.75rem" }}>
        {[
          "Acceso: conocer qué datos suyos tratamos.",
          "Rectificación: corregir datos inexactos o incompletos.",
          "Eliminación: solicitar la supresión de sus datos.",
          "Oposición: oponerse al tratamiento en determinadas circunstancias.",
          "Portabilidad: recibir sus datos en formato estructurado.",
          "Limitación: solicitar la restricción del tratamiento.",
        ].map((item) => (
          <li key={item} style={liStyle}>{item}</li>
        ))}
      </ul>
      <p style={pStyle}>
        Para ejercer estos derechos, envíe un correo a <strong style={{ color: "#DC2626" }}>privacidad@totalflexgym.com.ec</strong> indicando su nombre completo y el derecho que desea ejercer. Responderemos en un plazo máximo de <strong style={{ color: "#FAFAFA" }}>15 días hábiles</strong>.
      </p>

      <h2 style={h2Style}>7. TRANSFERENCIAS A TERCEROS</h2>
      <p style={pStyle}>
        TotalFlexGym <strong style={{ color: "#FAFAFA" }}>no vende, cede ni transfiere</strong> sus datos personales a terceros con fines comerciales. Únicamente los compartiremos con autoridades competentes cuando exista obligación legal.
      </p>

      <h2 style={h2Style}>8. SEGURIDAD DE LOS DATOS</h2>
      <p style={pStyle}>
        Aplicamos medidas técnicas y organizativas apropiadas para garantizar la seguridad de sus datos personales frente a accesos no autorizados, pérdida o divulgación, conforme al Art. 37 de la LOPDP.
      </p>

      <h2 style={h2Style}>9. AUTORIDAD DE CONTROL</h2>
      <p style={pStyle}>
        Si considera que el tratamiento de sus datos vulnera la normativa vigente, puede presentar una reclamación ante la <strong style={{ color: "#FAFAFA" }}>Superintendencia de Protección de Datos Personales del Ecuador</strong>, autoridad competente según el Art. 60 de la LOPDP.
      </p>

      <h2 style={h2Style}>10. MODIFICACIONES</h2>
      <p style={pStyle}>
        TotalFlexGym se reserva el derecho de actualizar esta política cuando sea necesario. Las modificaciones relevantes se notificarán a los miembros activos con al menos 10 días de anticipación.
      </p>
    </div>
  );
}
