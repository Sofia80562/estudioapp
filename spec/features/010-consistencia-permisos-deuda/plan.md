# Plan: 010 · Consistencia y Deuda Técnica

## Enfoque
Ejecutar una limpieza profunda ("Clean-up Sprint") para asegurar que no existan inconsistencias entre lo documentado en `spec.md` de cada feature y lo realmente implementado.

## Implementación
- **Consistencia API**: Revisar que cada controlador use `errorHandler`.
- **Limpieza**: Borrar código comentado o funciones `console.log` residuales.
- **Validación SDD**: Correr `npm run lint` y `npm run typecheck` para corregir errores de tipo que se ignoraron en el desarrollo rápido.
- **Swagger**: Revisar que el Swagger no tenga campos `null` o faltantes en los esquemas de respuesta.

## Decisiones Técnicas
- **Refactorización**: Si un servicio está demasiado acoplado, extraer la lógica a `lib/` o un helper.
- **Deuda Técnica**: Documentar en `documentation/DEBT.md` (o sección técnica) cualquier funcionalidad que se dejó pendiente o con una implementación subóptima.

## Riesgos
- Romper funcionalidades existentes durante la refactorización. Mitigación: Ejecutar la suite de tests (`npm run test`) antes y después de cada cambio importante.