# Plan: 008 · Entorno Demo de Autenticación

## Enfoque
Crear una vía de entrada alternativa que inyecte una sesión preconfigurada. El middleware de autenticación debe reconocer que este es un usuario "Demo" para omitir pasos de validación de tokens externos.

## Implementación
- **Ruta**: `pages/api/auth/demo/login.ts` disponible únicamente si `NODE_ENV !== 'production'`.
- **Lógica**: Crea un usuario dummy en la base de datos (o usa uno preexistente) y emite una cookie de sesión normal usando `lib/session/`.
- **Seguridad**: Validación estricta de `process.env.NODE_ENV` para prevenir fugas de esta funcionalidad en producción.

## Decisiones Técnicas
- **Sesión Stateless**: Reutiliza la lógica de `lib/session/` para que el resto de la aplicación trate al usuario demo como un usuario real.
- **Transparencia**: El usuario demo debe tener un rol predeterminado para probar todas las funcionalidades (ej: Admin Demo).

## Riesgos
- Activación accidental en producción. Mitigación: Hardcode de chequeo de entorno y mensaje de error explícito si se intenta acceder en `production`.