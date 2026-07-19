# Plan: 001 · Pipeline Spec-Driven (SDD)

## Enfoque
Establecer una capa de middleware que intercepte todas las peticiones `POST/PATCH` para validar el cuerpo de la petición (payload) y `GET` para validar parámetros de consulta (query) usando esquemas Zod estrictos.

## Decisiones
- Uso de **Zod** como librería estándar por su capacidad de inferir tipos de TypeScript.
- Middleware integrado en la cadena de `next-connect` para garantizar que la validación ocurra antes de cualquier acceso a base de datos.
- Generación de errores automáticos con código `VALIDATION_ERROR` cuando el payload no cumple el esquema.

## Riesgos
- Overhead de validación en peticiones muy frecuentes: Mitigación mediante caché de esquemas compilados.