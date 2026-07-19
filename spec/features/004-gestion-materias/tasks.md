# Tasks: 004 · Gestión de Organizaciones y Sedes

## Validaciones
- [ ] Crear esquemas Zod para `Organization` y `Venue`.

## Capa de datos y Servicios
- [ ] Implementar `database/organizations/index.ts`.
- [ ] Implementar `database/venues/index.ts`.
- [ ] Crear servicios para orquestar la relación 1:N.

## API Routes
- [ ] `pages/api/organizations/index.ts` (GET, POST).
- [ ] `pages/api/venues/index.ts` (GET, POST, con filtro por `organizationId`).
- [ ] `pages/api/venues/[venueId].ts` (CRUD detallado).

## Documentación Swagger
- [ ] Registrar `OrganizationResponse` y `VenueResponse`.
- [ ] Registrar rutas y requerimientos de permisos en `documentation/schemas/`.

## Tests
- [ ] Test de integridad: Intentar crear sede sin organización.
- [ ] Test de borrado lógico: Verificar que borrar Org inactiva sus Sedes.

## Cierre
- [ ] `npm run lint`, `typecheck`, `test`, `build`.
- [ ] Actualizar `roadmap.md`.