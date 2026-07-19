# Plan: 009 · Sesiones Persistentes

## Enfoque
Aprovechar el cifrado de `@hapi/iron` ya implementado en la feature 002. La persistencia se logra ajustando los parámetros de la cookie en el servidor, no mediante cambios en la base de datos, manteniendo la naturaleza stateless del backend.

## Implementación
- **Cookies**: Ajustar `setSessionCookie` para incluir `maxAge` (ej: 30 días).
- **Seguridad**: Asegurar que las cookies tengan los flags `HttpOnly`, `Secure` (en prod) y `SameSite=Lax`.
- **Rotación**: Implementar una breve validación en el `session.decrypt` para detectar si el token está próximo a expirar y refrescarlo si es necesario.

## Decisiones Técnicas
- **Estrategia Stateless**: Seguimos sin base de datos para sesiones (evitamos Redis por ahora), confiando en el cifrado robusto de la cookie persistente.
- **Revocación**: Como es stateless, la revocación física requiere una "lista negra" en base de datos si fuera necesario, pero por ahora se delega en la expiración del `SESSION_SECRET`.

## Riesgos
- Robo de cookie persistente. Mitigación: Configuración estricta de `SameSite` y uso exclusivo de HTTPS en producción.