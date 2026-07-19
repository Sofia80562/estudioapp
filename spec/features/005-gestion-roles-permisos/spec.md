# Spec: 005 · Gestión de Roles y Permisos

## Estado
✅ **Completada**

## Qué hace
Implementación del sistema de control de acceso basado en roles (RBAC), permitiendo definir conjuntos de permisos asociados a roles específicos para proteger los recursos académicos.

## Criterios de aceptación
- [x] CRUD completo para `Role` y `Permission`.
- [x] Relación N:M entre roles y permisos.
- [x] Middleware de autorización para verificar permisos a nivel de endpoint.
- [x] Semilla inicial (seeding) de roles básicos del sistema (ej: Admin, Estudiante, Profesor).
- [x] Documentación completa en Swagger.