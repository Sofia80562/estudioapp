# Tasks: 010 · Consistencia y Deuda Técnica

## Auditoría de Consistencia
- [ ] Revisar que todos los `pages/api` tengan el middleware `errorHandler` correctamente aplicado.
- [ ] Verificar que todos los endpoints devuelvan el formato `{ data: ... }` o `{ error: ... }`.

## Limpieza de Código
- [ ] Eliminar `console.log` y comentarios obsoletos en `services/` y `pages/api/`.
- [ ] Corregir advertencias de `eslint` y `typescript`.

## Swagger y Documentación
- [ ] Verificar que el Swagger genere todos los esquemas correctamente en `/api/docs`.
- [ ] Asegurar que no se exponen campos internos (ej: `oauthSubject`) en ninguna respuesta pública.

## Tests y Validación Final
- [ ] Ejecutar suite completa de tests de integración.
- [ ] Correr `npm run build` para asegurar que el proyecto compila sin errores.

## Cierre
- [ ] Crear informe breve de deuda técnica resuelta.
- [ ] Mover feature a "Completada" en `roadmap.md`.