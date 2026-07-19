# Tasks: 007 · Manejo de Errores Robusto

## Clases de Error
- [ ] Crear `errors/app-error.ts` (base).
- [ ] Implementar clases hijas (`ValidationError`, `NotFoundError`, etc.).

## Middleware Global
- [ ] Crear `middleware/error-handler.ts`.
- [ ] Registrar middleware en la cadena de `next-connect`.

## Integración
- [ ] Integrar capturador de errores de Zod (parsing de esquemas).
- [ ] Integrar capturador de errores de Prisma (P2002, P2025).

## Documentación Swagger
- [ ] Registrar componente `ErrorResponse` en `documentation/schemas/common.ts`.

## Cierre
- [ ] `npm run lint`, `typecheck`, `test`, `build`.
- [ ] Actualizar `roadmap.md`.