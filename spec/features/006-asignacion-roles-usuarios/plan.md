# Plan: 006 · Asignación de Roles a Usuarios

## Enfoque
Extender el servicio de `User` para manejar la relación `UserRole`. Se prioriza la integridad de la sesión, invalidando sesiones si el rol del usuario cambia drásticamente.

## Implementación
- **Database**: Tabla intermedia `UserRole`.
- **Servicios**: `userService.assignRole(userId, roleId)` y `userService.removeRole(userId, roleId)`.
- **API**: Endpoint `PATCH /api/users/[userId]/roles`.

## Decisiones Técnicas
- **Atomicidad**: Uso de transacciones para la actualización de roles para evitar estados inconsistentes (ej: fallo al asignar el nuevo rol pero éxito al quitar el anterior).
- **Sesiones**: Al cambiar roles, se recomienda marcar la sesión actual como "necesita refresco" o cerrar sesiones activas si la política de seguridad lo exige.

## Riesgos
- Elevación de privilegios no autorizada. Mitigación: Validar siempre que el usuario que ejecuta la acción tenga permisos de `roles.assign`.