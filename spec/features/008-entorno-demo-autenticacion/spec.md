# Spec: 008 · Entorno Demo de Autenticación

## Estado
✅ **Completada**

## Qué hace
Implementación de un entorno de autenticación simulado (Mock Auth) para agilizar el desarrollo y las pruebas de integración sin necesidad de realizar el flujo real de OAuth 2.0.

## Criterios de aceptación
- [x] Endpoint especial `POST /api/auth/demo/login` habilitado solo en entornos de desarrollo.
- [x] Generación de una sesión válida con usuario "Mock" para testeo rápido.
- [x] Protección de la ruta para evitar su uso en producción (guardia de entorno).
- [x] Documentación de uso en el README o documentación técnica.