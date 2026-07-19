# Roadmap

_Orden y estado de las features. Es la vista de "qué hay hecho, qué toca ahora y qué viene". Cada entrada apunta a su carpeta en `features/`._

## Hecho ✅

_Features completadas, en orden de implementación._

1. **000 · Modelado de Base de Datos Core** — Esquema Prisma para usuarios, materias y tareas.
2. **001 · Pipeline Spec-Driven (SDD)** — Configuración de middleware de validación con Zod y OpenAPI.
3. **002 · Autenticación Core (Login)** — OAuth 2.0 con sesiones cifradas (`@hapi/iron`).
4. **003 · Gestión de Usuarios** — CRUD de usuarios con permisos, filtrado y soft-delete.
5. **004 · Gestión de Materias (Subjects)** — CRUD completo para agrupar tareas, paginación y validación.
6. **005 · Gestión de Roles y Permisos** — Control granular de acceso académico (ej: Alumno, Profesor).
7. **006 · Asignación de Roles por Organización** — Asignación de alcances para profesores/alumnos.
8. **007 · Manejo Robusto de Errores** — Transformación centralizada de errores Zod/App a respuestas HTTP consistentes.
9. **008 · Entorno de Demostración** — Identity Provider configurado (Keycloak) y semilla para roles académicos.
10. **009 · Sesiones Persistentes** — Migración de tokens a base de datos para corregir límites de tamaño en cookies y asegurar invalidación inmediata.

## Siguiente 🔜

- **010 · Consistencia de Permisos y Deuda Técnica**
  1. **Consistencia de Nomenclatura:** Unificar permisos (ej: `tasks.read` vs `tareas.leer`) para asegurar coherencia en el middleware.
  2. **Reconciliación de Migraciones:** Resolver el checksum de migraciones desalineado en `prisma/migrations`.
  3. **Fix Build:** Corregir tipados `unknown` en los módulos de acceso a datos para que `yarn build` pase correctamente.

## Backlog / ideas 💡

- **011 · Motor de Tareas (Tasks CRUD)** — Gestión de entregas con estados (`PENDING`, `IN_PROGRESS`, `COMPLETED`) y fechas de vencimiento.
- **012 · Sistema de Timer (Pomodoro)** — Registro de sesiones de estudio, asociando tiempo invertido a tareas específicas.
- **013 · Notificaciones de Vencimiento** — Uso de BullMQ para enviar alertas de tareas próximas a vencer.
- **014 · Reportes Académicos** — Generación de PDFs/Excels con estadísticas de rendimiento mediante `pdfmake` y `ExcelJS`.
- **015 · Auditoría de Estudios** — Registro detallado de cambios en sesiones y estados de tareas.

> Cada feature nueva se crea como `features/NNN-nombre-feature/` con `spec.md`, `plan.md` y `tasks.md` antes de tocar código. 