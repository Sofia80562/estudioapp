# Tasks: 006 · Asignación de Roles a Usuarios

## Capa de datos
- [ ] Definir relación `UserRole` en Prisma.
- [ ] Crear métodos de asignación/remoción en `database/users/`.

## Lógica de Servicio
- [ ] Implementar `assignRole` y `removeRole` en `services/users/`.
- [ ] Añadir validación de existencia de usuario y rol.

## API Routes
- [ ] Crear endpoint `PATCH /api/users/[userId]/roles`.
- [ ] Aplicar middlewares: `authenticated`, `authorized` (permiso `users.manage`).

## Documentación Swagger
- [ ] Registrar esquema de `AssignRoleBody`.
- [ ] Registrar ruta `PATCH /users/{userId}/roles`.

## Tests
- [ ] Test: Asignación exitosa de rol a usuario.
- [ ] Test: Intento de asignación por usuario sin permisos (debe ser 403).
- [ ] Test: Revocación de roles.

## Cierre
- [ ] `npm run lint`, `typecheck`, `test`, `build`.
- [ ] Actualizar `roadmap.md`.