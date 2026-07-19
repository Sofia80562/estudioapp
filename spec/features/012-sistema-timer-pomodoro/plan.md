# Plan: 012 · Gestión de Materias

## Enfoque
Seguir el patrón de la feature 004 (Organizaciones) adaptado a entidades académicas.

## Implementación
- **Base de datos**: Modelo `Subject` con `organizationId` y `venueId` como llaves foráneas.
- **Servicios**: Métodos para obtener materias por sede o por organización.
- **API**: Endpoints en `/api/subjects`.

## Decisiones Técnicas
- **Integridad**: Validar que el `organizationId` del docente coincida con el de la materia si se desea estricto aislamiento de datos.
- **Soft-delete**: Implementar borrado lógico para no perder el histórico de materias de años anteriores.

## Riesgos
- Conflictos de IDs de materias entre organizaciones. Mitigación: Validar la unicidad del `code` dentro del scope de `organizationId`.