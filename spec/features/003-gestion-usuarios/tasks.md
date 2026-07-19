# Tasks: 003 · Gestión de Usuarios

## Validaciones
- [ ] Crear `validations/users/index.ts` con esquemas Zod.
- [ ] Validar `orderBy` contra lista permitida.

## Errores y Helpers
- [ ] Crear `errors/not-found-error.ts` y `errors/conflict-error.ts`.
- [ ] Crear `helper/pagination.ts`.

## Capa de datos y Servicios
- [ ] Crear `database/users/index.ts` (getAll, create, record).
- [ ] Crear `services/users/index.ts` (lógica de negocio).

## API Routes
- [ ] `pages/api/users/index.ts` (GET, POST).
- [ ] `pages/api/users/[userId].ts` (GET, PATCH, DELETE).

## Documentación Swagger
- [ ] Crear `documentation/schemas/users.ts` y registrar componentes.
- [ ] Registrar rutas en `registry.registerPath`.

## Tests
- [ ] Unitarios en `services/users/index.test.ts`.
- [ ] Integración en `tests/integration/users/`.

## Cierre
- [ ] `npm run lint`, `typecheck`, `test`, `build`.
- [ ] Actualizar `roadmap.md`.