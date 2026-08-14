import { Pool } from "pg";

// ── POOL DE CONEXIÓN POSTGRESQL ───────────────────────────────
// Reutiliza conexiones entre llamadas en desarrollo (hot-reload safe)
// En producción, Next.js serverless crea el pool por instancia.

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

function createPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL no está definida. Agrega la variable en .env.local"
    );
  }
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
}

// En desarrollo evitamos crear múltiples pools en cada hot-reload
const pool: Pool =
  process.env.NODE_ENV === "development"
    ? (global._pgPool ??= createPool())
    : createPool();

export default pool;
