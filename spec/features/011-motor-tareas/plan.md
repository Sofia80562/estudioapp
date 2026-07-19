# Plan: 011 · Motor de Tareas

## Enfoque
Implementación basada en el modelo `Task` definido en la feature 000. El motor debe ser capaz de manejar la relación `User -> Task` y `Subject -> Task`.

## Implementación
- **Database**: Asegurar la integridad referencial con `Subject`.
- **Servicios**: Lógica para cambiar estados y calcular tareas próximas a vencer.
- **API**: Endpoints RESTful para la manipulación de tareas.

## Decisiones Técnicas
- **Normalización**: Mantener el uso de `active` para el borrado lógico.
- **Escalabilidad**: Implementar filtros de búsqueda por estado y materia desde el inicio.

## Riesgos
- Carga masiva de tareas por usuario: Mitigación mediante paginación obligatoria en el endpoint `GET /tasks`.