# Plan: 015 · Panel de Reportes y Analytics

## Enfoque
Uso intensivo de consultas SQL optimizadas (vistas o queries directas) para no sobrecargar el ORM con cálculos pesados.

## Implementación
- **Database**: Creación de Vistas SQL (Views) para obtener estadísticas rápidas.
- **Servicios**: `AnalyticsService` para consolidar datos de `Grade` y `Task`.
- **API**: `/api/analytics/dashboard`.

## Decisiones Técnicas
- **Rendimiento**: Cachear resultados de reportes pesados si el volumen de datos crece.