# Actualización de Inscripción para Miembros Existentes (Renovación)

El objetivo es permitir que clientes que ya están registrados en la base de datos (identificados por su número de cédula) puedan volver a enviar el formulario de inscripción para renovar su plan o actualizar sus datos, sin chocar con la restricción de `cedula_unica`.

## Propuesta de Cambios

### 1. Nuevo Endpoint para Verificar Cédula
#### [NEW] `src/app/api/miembros/check/route.ts`
- Se creará un endpoint `GET /api/miembros/check?cedula=XXXX` que buscará en la base de datos si el cliente existe.
- Si existe, devolverá sus datos básicos (nombre, teléfono, fecha_nacimiento, etc.). Si no existe, devolverá un 404 o un objeto vacío.

### 2. Modificación del Formulario Modal
#### [MODIFY] `src/components/ui/enrollment-modal.tsx`
- En el Paso 1 (cuando el usuario ingresa la cédula y presiona "SIGUIENTE"), interceptaremos la acción.
- El formulario hará una petición rápida al nuevo endpoint.
- **Si el cliente ya existe:** Autocompletaremos los campos del formulario (nombre, apellido, teléfono, etc.) con los datos recuperados, ahorrándole tiempo al usuario, y pasaremos al Paso 2.
- **Si el cliente no existe:** Pasaremos al Paso 2 normalmente para un registro nuevo.

### 3. Actualización de la Lógica de Inscripción
#### [MODIFY] `src/app/api/inscripcion/route.ts`
- Modificaremos la consulta principal para usar un enfoque de "Upsert" (Insert or Update).
- Si la cédula ya existe (conflicto en `cedula_unica`), en lugar de lanzar un error, ejecutaremos un `UPDATE` en el registro existente.
- En el `UPDATE` actualizaremos los datos personales (por si el usuario cambió de teléfono o disciplina) y:
  - Cambiaremos la columna `renovacion` a `true`.
  - Actualizaremos la `fecha_renovacion` a `CURRENT_DATE` (o la fecha de expiración correspondiente).
- El mensaje de WhatsApp de bienvenida se seguirá enviando (podríamos ajustar el texto para que diga "Bienvenido de vuelta" si es renovación, opcionalmente).

> [!IMPORTANT]
> **Pregunta para ti:** Mencionas que `fecha_renovacion` se actualiza con la fecha cuando se envió el formulario. Sin embargo, en el script anterior la estábamos guardando como `CURRENT_DATE + INTERVAL '1 month'` (como fecha de próximo pago/vencimiento). ¿Deseas que al hacer la renovación la `fecha_renovacion` se guarde exactamente como hoy (`CURRENT_DATE`) o que le sume el tiempo del nuevo plan seleccionado? 

> [!NOTE]
> Por favor revisa el plan. Si estás de acuerdo, responde "Aprobado" y aclarame la duda sobre la fecha para comenzar a programarlo.
