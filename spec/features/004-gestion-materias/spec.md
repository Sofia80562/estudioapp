# Spec: 004 · Gestión de Organizaciones y Sedes

## Estado
✅ **Completada**

## Qué hace
Implementación del módulo para la administración de entidades jerárquicas: Organizaciones (tenants principales) y Sedes (dependencias/ubicaciones), asegurando el aislamiento de datos multi-tenant.

## Criterios de aceptación
- [x] CRUD completo para `Organization` y `Venue` (Sedes).
- [x] Relación jerárquica 1:N (Una Organización tiene muchas Sedes).
- [x] Validación de alcances en la creación de recursos.
- [x] Implementación de soft-delete en ambas entidades.
- [x] Documentación completa en Swagger.