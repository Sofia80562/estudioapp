# Plan: 005 · Gestión de Roles y Permisos

## Enfoque
Seguir el estándar de la Constitución Técnica para el control de acceso. Los roles actúan como contenedores de permisos, y los permisos son strings de la forma `recurso.accion`.

## Implementación
- **Base de datos**: Modelos `Role`, `Permission`, y tabla pivot `RolePermission`.
- **Servicios**: `RoleService` para gestionar la composición de permisos.
- **Middleware**: `middleware/authorized.ts` que valida si el usuario (vía su rol) posee el permiso requerido para el recurso.

## Decisiones Técnicas
- **Atomicidad**: El borrado de un rol desvincula sus permisos pero no borra los permisos existentes.
- **Seeds**: Uso de `prisma/seed.ts` para asegurar que el sistema siempre tenga los roles base al desplegar.

## Riesgos
- Configuración incorrecta de permisos bloqueando el acceso total. Mitigación: Implementación de un rol 'SuperAdmin' hardcoded o protegido que no puede ser alterado.