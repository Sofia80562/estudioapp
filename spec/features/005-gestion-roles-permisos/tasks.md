# Tasks: 005 · Gestión de Roles y Permisos

## Base de Datos
- [ ] Crear modelos `Role`, `Permission` y relación `RolePermission`.
- [ ] Ejecutar migraciones.
- [ ] Crear seed script para roles base.

## Lógica de Negocio
- [ ] Crear `services/roles-permisos/`.
- [ ] Implementar validadores para creación de roles.

## API Routes
- [ ] Endpoints para `/api/roles` y `/api/permissions`.
- [ ] Integrar validación de permisos en los controladores existentes.

## Middleware
- [ ] Crear `middleware/authorized.ts` para validación granular.

## Documentación Swagger
- [ ] Registrar `RoleResponse` y `PermissionResponse`.
- [ ] Documentar `securitySchemes` para permisos.

## Cierre
- [ ] `npm run lint`, `typecheck`, `test`, `build`.
- [ ] Actualizar `roadmap.md`.