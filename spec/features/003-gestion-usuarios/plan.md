# Plan: 003 · Gestión de Usuarios

## Enfoque
Seguir la arquitectura por capas definida en la Constitución Técnica: `database/` para persistencia, `services/` para reglas de negocio y `pages/api/` para la interfaz HTTP.

## Implementación
- **Validaciones**: Esquemas Zod obligatorios para `body`, `query` y `params` en `validations/users/`.
- **Acceso a datos**: Implementación de `getAll`, `create` y `record(id)` siguiendo el patrón definido.
- **Servicios**: Orquestación de lógica, manejo de errores de dominio y uso de transacciones Prisma.
- **API**: Endpoints protegidos por middleware (`authenticated`, `authorized`) con respuestas estandarizadas.

## Decisiones Técnicas
- **Soft-delete**: Uso de campo `active: false` y `deletedAt` en lugar de borrar registros.
- **Error Handling**: Conversión de errores de Prisma (ej: duplicados P2002) a `ConflictError` de la clase `AppError`.
- **OpenAPI**: Registro de componentes y rutas en paralelo al desarrollo del endpoint.

## Riesgos
- Exposición accidental de campos sensibles (oauthSubject, password). Mitigación: Uso de transformadores o `select` explícitos en Prisma.