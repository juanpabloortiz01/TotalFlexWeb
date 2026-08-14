-- ============================================================
--  TotalFlexGym — Schema PostgreSQL (MVP)
--  Gestión: Easypanel + pgAdmin 4
--  Revisión: Fase 1
-- ============================================================

-- ── EXTENSIONES ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── ENUM TYPES ───────────────────────────────────────────────

CREATE TYPE plan_tipo AS ENUM (
  'mensual',
  'trimestral',
  'anual'
);

CREATE TYPE membresia_estado AS ENUM (
  'pendiente',
  'activa',
  'expirada',
  'cancelada'
);

CREATE TYPE pago_estado AS ENUM (
  'pendiente',
  'aprobado',
  'rechazado',
  'reembolsado'
);

CREATE TYPE pasarela_tipo AS ENUM (
  'payphone',
  'stripe'
);

CREATE TYPE disciplina_tipo AS ENUM (
  'bailoterapia',
  'pesas',
  'funcional',
  'box',
  'mma',
  'spinning',
  'pilates',
  'calistenia',
  'jiujitsu'
);

-- ── TABLA: miembros ──────────────────────────────────────────
-- Datos personales del cliente. Cumplimiento: solo nombre,
-- email, teléfono y cédula. CERO datos bancarios almacenados.
CREATE TABLE IF NOT EXISTS miembros (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      VARCHAR(120) NOT NULL,
  email       VARCHAR(254) NOT NULL UNIQUE,
  whatsapp    VARCHAR(20)  NOT NULL,
  cedula      VARCHAR(13)  NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_miembros_email   ON miembros (email);
CREATE INDEX idx_miembros_cedula  ON miembros (cedula);

-- ── TABLA: membresias ────────────────────────────────────────
-- Un miembro puede tener múltiples membresías a lo largo del tiempo.
CREATE TABLE IF NOT EXISTS membresias (
  id            UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  miembro_id    UUID              NOT NULL REFERENCES miembros(id) ON DELETE CASCADE,
  disciplina    disciplina_tipo   NOT NULL,
  plan          plan_tipo         NOT NULL,
  estado        membresia_estado  NOT NULL DEFAULT 'pendiente',
  fecha_inicio  DATE,
  fecha_fin     DATE,
  created_at    TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_membresias_miembro_id ON membresias (miembro_id);
CREATE INDEX idx_membresias_estado     ON membresias (estado);

-- ── TABLA: pagos ─────────────────────────────────────────────
-- Registro de cada transacción. La pasarela guarda los datos
-- de tarjeta; aquí solo se guarda el ID externo de transacción.
CREATE TABLE IF NOT EXISTS pagos (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  membresia_id     UUID          NOT NULL REFERENCES membresias(id) ON DELETE RESTRICT,
  monto            NUMERIC(8, 2) NOT NULL CHECK (monto > 0),
  moneda           CHAR(3)       NOT NULL DEFAULT 'USD',
  pasarela         pasarela_tipo NOT NULL,
  transaccion_id   VARCHAR(128)  NOT NULL UNIQUE, -- ID externo de la pasarela
  estado           pago_estado   NOT NULL DEFAULT 'pendiente',
  metadata         JSONB,        -- Datos extra de la pasarela (sin tarjetas)
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pagos_membresia_id   ON pagos (membresia_id);
CREATE INDEX idx_pagos_transaccion_id ON pagos (transaccion_id);
CREATE INDEX idx_pagos_estado         ON pagos (estado);

-- ── TABLA: webhook_logs ──────────────────────────────────────
-- Trazabilidad completa de webhooks recibidos.
-- Permite conciliación manual si el webhook falla pero el pago
-- fue aprobado en la pasarela (ver spec §4 Manejo de Errores).
CREATE TABLE IF NOT EXISTS webhook_logs (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  pasarela     pasarela_tipo NOT NULL,
  evento       VARCHAR(64),             -- Ej: 'payment.approved', 'payment.failed'
  payload      JSONB        NOT NULL,   -- Cuerpo raw del webhook
  procesado    BOOLEAN      NOT NULL DEFAULT FALSE,
  error_msg    TEXT,                    -- Si el procesamiento falló, motivo
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_logs_pasarela   ON webhook_logs (pasarela);
CREATE INDEX idx_webhook_logs_procesado  ON webhook_logs (procesado);
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs (created_at DESC);

-- ── TABLA: leads_pase_prueba ─────────────────────────────────
-- CU-03: Captura de leads via "Pase Gratis 1 Día" (spec §3 Módulo B)
CREATE TABLE IF NOT EXISTS leads_pase_prueba (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre       VARCHAR(120) NOT NULL,
  whatsapp     VARCHAR(20)  NOT NULL,
  codigo_qr    VARCHAR(64)  NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  usado        BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_whatsapp ON leads_pase_prueba (whatsapp);

-- ── FUNCIÓN: actualizar updated_at automáticamente ──────────
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_miembros
  BEFORE UPDATE ON miembros
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_membresias
  BEFORE UPDATE ON membresias
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_pagos
  BEFORE UPDATE ON pagos
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ── VISTA: membresias_activas ────────────────────────────────
-- Vista útil para pgAdmin 4 y consultas rápidas del admin
CREATE OR REPLACE VIEW membresias_activas AS
  SELECT
    m.id          AS membresia_id,
    mb.nombre,
    mb.email,
    mb.whatsapp,
    m.disciplina,
    m.plan,
    m.fecha_inicio,
    m.fecha_fin,
    p.monto,
    p.pasarela,
    p.transaccion_id
  FROM membresias m
  JOIN miembros  mb ON mb.id = m.miembro_id
  LEFT JOIN pagos p  ON  p.membresia_id = m.id AND p.estado = 'aprobado'
  WHERE m.estado = 'activa'
  ORDER BY m.fecha_fin ASC;
