# Plan: 004 · Gestión de Organizaciones y Sedes

## Enfoque
Seguir el patrón de diseño implementado en la feature 003, adaptando los servicios para manejar la relación padre-hijo (Organization -> Venue).

## Implementación
- **Validaciones**: Esquemas Zod que aseguren la existencia de `organizationId` al crear una `Venue`.
- **Acceso a datos**: Métodos que permitan listar sedes filtradas por su organización padre.
- **Servicios**: Lógica para asegurar que una sede no pueda ser asignada a una organización inexistente.
- **API**: Endpoints `/api/organizations` y `/api/venues`.

## Decisiones Técnicas
- **Integridad**: Uso de transacciones en el borrado de organizaciones para asegurar que sus sedes asociadas sean inactivadas (borrado lógico).
- **Autorización**: Validación de `organizaciones.manage` para permitir la modificación de registros.

## Riesgos
- Orfandad de sedes: Mitigación mediante `cascade soft-delete` en el servicio de organizaciones.