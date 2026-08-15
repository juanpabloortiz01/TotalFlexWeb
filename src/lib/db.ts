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
    console.warn("⚠️ DATABASE_URL no está definida. Si esto ocurre en build time, es normal.");
  }
  return new Pool({
    connectionString: process.env.DATABASE_URL || "postgres://dummy:dummy@localhost/dummy",
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
