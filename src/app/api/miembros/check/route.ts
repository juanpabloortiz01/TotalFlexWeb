import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const cedula = req.nextUrl.searchParams.get("cedula");

  if (!cedula || cedula.length !== 10) {
    return NextResponse.json({ error: "Cédula inválida." }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `SELECT nombre, telefono, fecha_nacimiento, disciplina, horario_preferido, ocupacion 
       FROM miembros 
       WHERE cedula = $1 
       LIMIT 1`,
      [cedula]
    );

    if (result.rows.length > 0) {
      return NextResponse.json({ exists: true, data: result.rows[0] });
    } else {
      return NextResponse.json({ exists: false });
    }
  } catch (err) {
    console.error("[GET /api/miembros/check] Error en DB:", err);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
