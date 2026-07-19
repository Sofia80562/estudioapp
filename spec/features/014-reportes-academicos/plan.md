# Plan: 014 · Notificaciones y Avisos

## Enfoque
Implementación de un modelo de "Notification" simple vinculado al usuario.

## Implementación
- **Database**: Modelo `Notification` con `userId`, `message`, `type`, `readAt`.
- **Servicio**: Helper para crear notificaciones automáticamente tras eventos en `TaskService` o `GradeService`.
- **API**: Endpoints en `/api/notifications`.

## Decisiones Técnicas
- **Limpieza**: Job programado para limpiar notificaciones leídas de más de 30 días.