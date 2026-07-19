# Plan: 013 · Gestión de Calificaciones y Progreso

## Enfoque
Seguir el patrón de diseño de servicios implementado en la feature 011 (Tareas), añadiendo lógica de agregación (cálculos de promedios).

## Implementación
- **Base de datos**: Modelo `Grade` (calificación) con relación `userId` y `subjectId`.
- **Servicios**: `GradeService` que incluya métodos para cálculo de promedios ponderados.
- **API**: Endpoints en `/api/grades`.

## Decisiones Técnicas
- **Flexibilidad**: Permitir diferentes escalas de notas (0-10, 0-100, letras) almacenando la configuración en la `Organization`.
- **Atomicidad**: Validar que una calificación no exceda los límites definidos en la escala de la materia.

## Riesgos
- Inconsistencia en el cálculo de promedios si se borra una tarea calificada. Mitigación: Implementar `soft-delete` y re-cálculo asíncrono o bajo demanda.