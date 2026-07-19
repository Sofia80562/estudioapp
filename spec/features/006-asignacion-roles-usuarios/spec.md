# Spec: 006 · Asignación de Roles a Usuarios

## Estado
✅ **Completada**

## Qué hace
Implementación de la lógica para asignar, actualizar y revocar roles a los usuarios del sistema, controlando así el alcance de sus permisos dentro de `estudioapp`.

## Criterios de aceptación
- [x] Endpoint para asignar/remover roles a un usuario específico.
- [x] Validación para asegurar que un usuario no se quede sin roles si es obligatorio.
- [x] Registro de cambios en la tabla de asignación.
- [x] Middleware que verifica que el asignador tenga permisos de 'administración de usuarios'.
- [x] Documentación completa en Swagger.