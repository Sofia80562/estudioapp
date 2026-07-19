# Tasks: 008 · Entorno Demo de Autenticación

## Implementación
- [ ] Crear `pages/api/auth/demo/login.ts`.
- [ ] Implementar guardia `if (process.env.NODE_ENV === 'production') return 404`.
- [ ] Integrar `lib/session/setSessionCookie` con usuario demo.

## Pruebas
- [ ] Verificar login con usuario demo en local.
- [ ] Verificar que los endpoints protegidos reconocen la sesión demo.

## Cierre
- [ ] `npm run lint`, `typecheck`, `test`, `build`.
- [ ] Actualizar `roadmap.md`.