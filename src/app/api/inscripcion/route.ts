import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// ── POST /api/inscripcion ─────────────────────────────────────
// Registra un nuevo miembro en la tabla `miembros`.
// Body esperado (JSON):
//   nombre, apellido, fechaNacimiento, telefono,
//   disciplina, horario, ocupacion, comentarios, plan
// ─────────────────────────────────────────────────────────────
async function enviarMensajeBienvenida({
  nombre,
  telefono,
  plan,
  fecha_inscripcion,
}: {
  nombre: string;
  telefono: string;
  plan: string;
  fecha_inscripcion: string;
}) {
  const mensaje = `¡Hola ${nombre}! 🎉 Bienvenido/a al gimnasio. Tu inscripción al plan *${plan}* quedó activada desde el ${fecha_inscripcion}. Cualquier duda sobre horarios o accesos, escríbenos por este mismo chat. ¡Nos vemos en el gym! 💪`;

  try {
    const url = `https://quantum-evolution-api.fpjdvh.easypanel.host/message/sendText/${process.env.EVO_INSTANCE || "TU_INSTANCIA_AQUI"}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: "429683C4C977415CAAFCCE10F7D57E11",
      },
      body: JSON.stringify({
        number: telefono,
        text: mensaje,
      }),
    });
    if (!res.ok) {
      console.error("Error de EvoAPI:", await res.text());
    }
  } catch (error: any) {
    console.error("Error enviando mensaje de bienvenida:", error.message);
  }
}

export async function POST(req: NextRequest) {
  let body: Record<string, string>;

  // 1. Parsear body
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de la solicitud inválido." },
      { status: 400 }
    );
  }

  const {
    cedula,
    nombre,
    apellido,
    fechaNacimiento,
    telefono,
    disciplina,
    horario,
    ocupacion,
    comentarios,
    plan,
  } = body;

  // 2. Validar campos obligatorios
  if (!nombre?.trim() || !telefono?.trim() || !plan?.trim()) {
    return NextResponse.json(
      { error: "Los campos nombre, teléfono y plan son obligatorios." },
      { status: 400 }
    );
  }
  if (!cedula?.trim() || cedula.trim().length !== 10) {
    return NextResponse.json(
      { error: "La cédula debe tener exactamente 10 dígitos." },
      { status: 400 }
    );
  }

  // 3. Resolver membresia_id a partir del plan seleccionado
  //    Busca en la tabla membresias por nombre/tipo (case-insensitive).
  let membresiaId: number | null = null;
  try {
    const memRes = await pool.query<{ id: number }>(
      `SELECT id FROM membresias
       WHERE LOWER(nombre) = LOWER($1)
       LIMIT 1`,
      [plan]
    );
    if (memRes.rows.length > 0) {
      membresiaId = memRes.rows[0].id;
    }
  } catch (err) {
    console.error("[POST /api/inscripcion] Error al resolver membresia_id:", err);
    membresiaId = null;
  }

  // 4. Insertar en miembros
  try {
    const nombreCompleto = apellido?.trim()
      ? `${nombre.trim()} ${apellido.trim()}`
      : nombre.trim();

    const result = await pool.query<{ id: number }>(
      `INSERT INTO miembros
         (cedula, nombre, fecha_nacimiento, telefono, disciplina,
          horario_preferido, ocupacion, membresia_id, fecha_inscripcion, fecha_renovacion, renovacion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE, CURRENT_DATE, false)
       ON CONFLICT (cedula) DO UPDATE SET
         nombre = EXCLUDED.nombre,
         fecha_nacimiento = EXCLUDED.fecha_nacimiento,
         telefono = EXCLUDED.telefono,
         disciplina = EXCLUDED.disciplina,
         horario_preferido = EXCLUDED.horario_preferido,
         ocupacion = EXCLUDED.ocupacion,
         membresia_id = EXCLUDED.membresia_id,
         fecha_renovacion = CURRENT_DATE,
         renovacion = true
       RETURNING id`,
      [
        cedula.trim(),
        nombreCompleto,
        fechaNacimiento || null,
        telefono.trim(),
        disciplina || null,
        horario || null,
        ocupacion || null,
        membresiaId,
      ]
    );

    const newId = result.rows[0].id;

    // Enviar mensaje de bienvenida por WhatsApp (EvoAPI)
    // El teléfono lo mandamos como 593XXXXXXXXX (sin el 0 inicial de Ecuador)
    const hoy = new Date().toLocaleDateString("es-EC");
    let telEvo = telefono.trim();
    if (telEvo.startsWith("0")) {
      telEvo = telEvo.substring(1);
    }
    
    await enviarMensajeBienvenida({
      nombre: nombre.trim(),
      telefono: `593${telEvo}`,
      plan,
      fecha_inscripcion: hoy,
    });

    return NextResponse.json(
      { success: true, id: newId, message: "Inscripción registrada con éxito." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/inscripcion] Error en DB:", err);
    return NextResponse.json(
      { error: "Error interno al guardar la inscripción. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
