# Plan: 007 · Manejo de Errores Robusto

## Enfoque
Centralizar toda la lógica de errores fuera de los controladores. El API debe ser "limpia" y dejar que los errores burbujeen hasta el middleware global.

## Implementación
- **Clases**: Definir `AppError` (base), `ValidationError`, `NotFoundError`, `ConflictError`, `UnauthorizedError`.
- **Middleware**: Un único `catch` global que decide qué loguear y qué exponer al cliente.
- **Transformación**: Capturar errores de librería (Prisma, Zod, JWT) y transformarlos a `AppError`.

## Decisiones Técnicas
- **Seguridad**: Nunca exponer el stack trace en entornos de producción.
- **Consistencia**: Todos los errores deben tener el mismo formato JSON para que el cliente (Flutter) pueda parsearlos fácilmente.

## Riesgos
- Ocultar errores críticos del sistema. Mitigación: Loguear todo en `console.error` (o sistema de logs) antes de transformar el error para el cliente.