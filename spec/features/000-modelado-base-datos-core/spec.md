# Spec: 000 · Modelado de Base de Datos Core

## Estado
✅ **Completada**

## Qué hace
Diseño y normalización del esquema de base de datos fundamental para `estudioapp`, estableciendo las entidades principales y sus relaciones.

## Criterios de aceptación
- [x] Esquema Prisma definido con entidades: `User`, `Subject` (Materias), `Task` (Tareas).
- [x] Definición de relaciones 1:N y M:N necesarias.
- [x] Implementación de soft-delete (`active: false`) en entidades críticas.
- [x] Migración inicial aplicada exitosamente.