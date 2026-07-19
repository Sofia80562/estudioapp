# Plan: 000 · Modelado de Base de Datos Core

## Enfoque
Definición de entidades en `prisma/schema.prisma` respetando la convención de `active` para borrado lógico. Se priorizó la integridad referencial y la escalabilidad del modelo.

## Decisiones
- Uso de UUIDs para identificadores primarios.
- Aplicación de 3FN (Tercera Forma Normal) para evitar redundancia en las materias.
- Tipos de datos estándar (DateTime para auditoría, String para descripciones).

## Riesgos
- Conflictos futuros en relaciones complejas: Mitigación mediante el uso estricto de Prisma Studio para validación de datos.