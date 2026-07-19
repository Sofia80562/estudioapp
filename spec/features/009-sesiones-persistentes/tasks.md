# Tasks: 009 · Sesiones Persistentes

## Configuración
- [ ] Ajustar `lib/session/index.ts` con `maxAge` de 30 días.
- [ ] Verificar flags `HttpOnly`, `Secure` y `SameSite` en el navegador.

## Lógica de Refresco
- [ ] Implementar lógica de "Refresh" si la sesión está al 80% de su vida útil.
- [ ] Probar persistencia cerrando y abriendo el navegador.

## Documentación
- [ ] Actualizar `documentation/schemas/auth.ts` con detalles de la política de cookies.

## Cierre
- [ ] `npm run lint`, `typecheck`, `test`, `build`.
- [ ] Actualizar `roadmap.md`.