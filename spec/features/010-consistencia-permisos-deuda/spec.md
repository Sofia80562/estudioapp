# Spec: 010 · Consistencia y Deuda Técnica

## Estado
 **En curso**

## Qué hace
Auditoría y refactorización de la deuda técnica acumulada durante el desarrollo de las features 000-009, garantizando la consistencia de permisos, normalización de respuestas API y limpieza de código muerto.

## Criterios de aceptación
- [x] Unificación del formato de error en todos los endpoints (middleware global).
- [x] Eliminación de "logs" de debug en producción.
- [x] Verificación de que todos los endpoints devuelven esquemas validados.
- [x] Sincronización completa de la documentación Swagger con el código real.
- [x] Auditoría de permisos: asegurar que `authorized` protege todas las rutas críticas.