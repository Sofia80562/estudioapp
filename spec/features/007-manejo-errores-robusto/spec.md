# Spec: 007 · Manejo de Errores Robusto

## Estado
✅ **Completada**

## Qué hace
Establecimiento de una infraestructura global para la captura, procesamiento y respuesta de errores, asegurando que el API devuelva códigos de estado HTTP semánticos y mensajes legibles, sin exponer trazas internas.

## Criterios de aceptación
- [x] Clase base `AppError` para errores de dominio controlados.
- [x] Middleware global de error (`errorHandler`) para capturar excepciones no controladas.
- [x] Formato de respuesta de error estandarizado: `{ error: { code, message, details } }`.
- [x] Validación de errores de Zod integrados en el middleware.
- [x] Documentación de errores comunes en Swagger.