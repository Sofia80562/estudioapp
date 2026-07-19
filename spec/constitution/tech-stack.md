# Tech stack y convenciones

_Cómo está construido el proyecto y las reglas que todo el código debe respetar. Es la referencia técnica que ningún plan de feature debería contradecir._

## Tecnologías

- **Lenguaje:** TypeScript en modo estricto, evitando el uso de `any`.
- **Framework / runtime:** Node.js 22 o superior con Next.js y Pages Router.
- **API routing:** API Routes de Next.js dentro de `pages/api/`, estructuradas mediante `next-connect`.
- **Arquitectura:** Monolito modular con separación entre API Routes, middlewares, servicios, acceso a datos e integraciones.
- **Base de datos:** PostgreSQL con Prisma ORM.
- **Validación:** Zod para cuerpos, parámetros, consultas, cookies y datos externos.
- **Autenticación:** OAuth 2.0 y sesiones cifradas con `@hapi/iron`.
- **Caché:** Redis mediante `ioredis`.
- **Tests:** Vitest para pruebas unitarias y de integración.
- **Calidad de código:** ESLint, Prettier y TypeScript (estricto).
- **Gestor de paquetes:** Yarn.

El proyecto es exclusivamente backend. No se desarrollarán páginas visuales ni componentes React.

## Archivos / módulos clave

- `pages/api/auth/` — Inicio de sesión OAuth 2.0, sesiones y cierre de sesión.
- `pages/api/academic/` — Gestión de materias, cursos y periodos académicos.
- `pages/api/tasks/` — Operaciones CRUD para el ciclo de vida de tareas y entregas.
- `pages/api/timer/` — Registro de sesiones de enfoque y estudio.
- `middleware/` — Cadena de validación, seguridad (auth, access), caché y logging.
- `database/` — Capa de acceso a datos utilizando el cliente central de Prisma.
- `services/` — Reglas de negocio y coordinación de tareas.
- `validations/` — Esquemas Zod para la normalización de entradas.
- `lib/` — Clientes externos (Redis, Email, Logger, etc.).
- `prisma/` — Modelos, migraciones y seeders de datos iniciales.

## Estructura general

```text
project/
├── pages/
│   └── api/
│       ├── academic/
│       ├── auth/
│       ├── notifications/
│       ├── roles/
│       ├── tasks/
│       ├── timer/
│       └── users/
├── database/
├── services/
├── middleware/
├── validations/
├── lib/
├── prisma/
└── tests/

## Comandos de desarrollo

Estos scripts gestionan el ciclo de vida del proyecto.

- `yarn dev`: Arranca el servidor de desarrollo.
- `yarn build`: Compila el proyecto para producción.
- `yarn typecheck`: Comprobación estática de tipos.
- `yarn test`: Ejecuta pruebas con Vitest.
- `yarn generate`: Genera el cliente Prisma.
- `yarn migrate-dev`: Aplica migraciones locales.
- `yarn seed`: Carga datos obligatorios.
- `yarn worker:*`: Inicia procesos asíncronos (email, notificaciones, reportes).

### Scripts (package.json)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "generate": "prisma generate",
    "migrate-dev": "prisma migrate dev",
    "migrate-deploy": "prisma migrate deploy",
    "seed": "prisma db seed",
    "seed-dev": "tsx prisma/seed-dev.ts",
    "prisma-studio": "prisma studio",
    "worker:email": "tsx workers/email.worker.ts",
    "worker:notification": "tsx workers/notification.worker.ts",
    "worker:report": "tsx workers/report.worker.ts"
  },
  "engines": {
    "node": ">=22"
  }
}

## Modelo de datos / dominio

- `User.oauthSubject`: Identificador único de proveedor (no depender de email).
- `User.active`: Control de acceso al sistema (soft-delete).
- `Task`: Entidad central. Campos obligatorios: `title`, `status` (Enum), `priority`.
- `Subject`: Agrupador académico. Relación `1:N` con `Task`.
- `TimerSession`: Registro de enfoque. Campos: `startTime`, `endTime`, `taskId`.
- `AuditLog`: Registro obligatorio para cambios en tareas y sesiones.
- `Campos monetarios`: Usar `Decimal` (nunca `Float`).
- `Fechas`: Almacenamiento en UTC; transformación solo en límites de API.
- `Eliminaciones`: Definir explícitamente `onDelete`; preferir `active: false` (eliminación lógica).
- `Paginación`: Obligatoria en todos los listados (`GET /api/tasks`, etc.).
- `Esquema`: Se utiliza el esquema `public` de PostgreSQL.

## Convenciones de código

- **Estilo**: TypeScript estricto, indentación 2 espacios, comillas simples, punto y coma obligatorio.
- **Nomenclatura**: `camelCase` (variables/funciones), `PascalCase` (tipos/clases), `UPPER_SNAKE_CASE` (constantes).
- **Archivos**: `kebab-case.ts` para archivos y directorios.
- **Seguridad**: No usar `any`; usar `unknown` y validar siempre con Zod.
- **Importaciones**: Usar alias para evitar rutas relativas profundas; `import type` para tipos.

## Convención de API Routes

Las APIs se agrupan por recurso académico.

### Patrones de archivo:
1. **Colección** (`pages/api/<modulo>/index.ts`):
   - `GET /api/tasks` → Listar tareas (con paginación).
   - `POST /api/tasks` → Crear tarea.

2. **Recurso individual** (`pages/api/<modulo>/[resourceId].ts`):
   - `GET /api/tasks/:taskId` → Ver detalle.
   - `PATCH /api/tasks/:taskId` → Actualizar.
   - `DELETE /api/tasks/:taskId` → Eliminar (soft-delete).

3. **Sub-recurso** (`pages/api/<modulo>/[resourceId]/<submodulo>/index.ts`):
   - `GET /api/subjects/:subjectId/tasks` → Listar tareas de una materia.

### Reglas de implementación:
- **Middleware**: Aplicar `auth` → `access` → `parser` → `handler`.
- **Delegación**: Las rutas NUNCA ejecutan Prisma directamente; llaman a `services/`.
- **Validación**: Todo `body` o `query` debe validarse con esquemas de `validations/`.
- **Respuesta**: Usar siempre helpers estandarizados (`api.success`, `api.error`).

### Estructura de ejemplo para estudioapp:
```text
pages/api/
├── academic/
│   └── subjects/
│       ├── index.ts              GET/POST materias
│       └── [subjectId].ts        GET/PATCH/DELETE materia
├── tasks/
│   ├── index.ts                  GET/POST tareas
│   └── [taskId].ts               GET/PATCH/DELETE tarea
└── timer/
    └── sessions/
        └── index.ts              POST crear sesión de estudio


# Plantillas de API Routes
1.  **Colección** (pages/api/<modulo>/index.ts)

import { createRouter } from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/middleware/auth';
import { api } from '@/middleware/api';
import { access } from '@/middleware/access';
import { database } from '@/middleware/database';
import { parser } from '@/middleware/parser';
import ResourceData, { ESCAPE } from '@/database/<modulo>/resource';

const handler = createRouter<NextApiRequest, NextApiResponse>();
handler
  .use(auth).use(api).use(access('resource')).use(database(ResourceData))
  .get((request) => {
    request.do('read', async (api, prisma) => {
      const query = prisma.resource.where({ ...api.where, ...api.filter });
      query.setCount(api.count);
      return api.successMany(await query.getAll());
    });
  })
  .use(parser.escape(ESCAPE))
  .post((request) => {
    request.do('create', async (api, prisma) => {
      return api.success(await prisma.resource.create(request.body));
    });
  });

export default handler.handler({
  onError: (e, req, res) => res.status(500).json({ error: 'INTERNAL_ERROR' }),
  onNoMatch: (req, res) => res.status(405).json({ error: 'METHOD_NOT_ALLOWED' }),
});

2. **Recurso individual** (pages/api/<modulo>/[resourceId].ts)

handler
  .get((request) => {
    request.do('read', async (api, prisma) => {
      return api.successOne(await prisma.resource.record(request.query.resourceId).getUnique());
    });
  })
  .patch((request) => {
    request.do('write', async (api, prisma) => {
      return api.success(await prisma.resource.record(request.query.resourceId).update(request.body));
    });
  })
  .delete((request) => {
    request.do('remove', async (api, prisma) => {
      return api.success(await prisma.resource.record(request.query.resourceId).update({ active: false }));
    });
  });

## Convenciones de Arquitectura y Buenas Prácticas

### 1. Acceso a Datos (`database/`)
*   **Encapsulamiento**: La capa `database/` debe encapsular Prisma totalmente; no debe conocer nada sobre HTTP, cookies o permisos.
*   **Patrón**: Exportar un objeto con métodos `getAll`, `create` y un método `record(id)` que devuelva un objeto con `getUnique`, `update` y `remove`.
*   **Regla**: Las consultas Prisma **nunca** deben ejecutarse fuera de este módulo.

### 2. Servicios (`services/`)
*   **Responsabilidad**: Implementar reglas de negocio, transacciones, gestión de caché e invalidación.
*   **Tareas**: Orquestar el envío de trabajos a **BullMQ** y coordinar integraciones.
*   **Restricción**: Los servicios **no deben** recibir objetos `NextApiRequest` ni `NextApiResponse`.

### 3. Validación y Seguridad
*   **Entradas**: Toda entrada externa (`body`, `query`, `cookies`) debe validarse obligatoriamente con **Zod**.
*   **Sanitización**: Contextual y no destructiva. No aplicar escape SQL manual; dejar que Prisma parametrice las consultas.
*   **Auth/Authz**: OAuth 2.0 (Authorization Code Flow) + OpenID Connect. Autorización basada en permisos (`<recurso>.<acción>`), no solo roles.
*   **Cookies**: **HttpOnly**, **Secure**, **SameSite**, firmadas y cifradas con `@hapi/iron`.

### 4. Respuestas y Errores
*   **Estandarización**: Usar helpers `api.success`, `api.successOne`, `api.successMany`.
*   **Estructura de error**: Clase base `AppError` (extensible a `AuthenticationError`, `BusinessRuleError`, etc.).
*   **HTTP**: Responder con códigos semánticos (200, 201, 400, 401, 403, 404, 422, 500). **Nunca responder con 200 ante un fallo.**

### 5. Caché, Colas y Logging
*   **Redis**: Claves con prefijos por módulo/recurso. Invalidación inmediata tras escritura.
*   **BullMQ**: Obligatorio para reportes, correos, notificaciones y procesos pesados. Ejecución en procesos independientes.
*   **Logging**: JSON estructurado con **Pino**. Incluir siempre `requestId`. Prohibido registrar secretos o tokens.

### 6. Tests y Variables
*   **Ubicación**: Tests unitarios junto al archivo; integración en `tests/integration/`.
*   **Variables**: Documentadas en `.env.example`, validadas con **Zod** al inicio. Prohibido exponer valores reales.

### 7. Checklist de Validación de API Routes
*Antes de realizar el commit de cualquier ruta, asegúrese de cumplir con los siguientes puntos:*

- [ ] **¿Existe la capa `database/<modulo>/resource` y exporta la constante `ESCAPE`?**
- [ ] **¿Es correcto el `scope` en `access('<scope>')`?**
- [ ] **¿Se validó el payload con Zod antes de escribir?**
- [ ] **¿Se utiliza `{ active: false }` para el borrado lógico?**
- [ ] **¿Se probaron: listado, creación, lectura, edición, borrado y permisos?**

---

## Límites duros (Prohibiciones terminantes)

*   **Arquitectura**: Prohibido App Router, frontend, componentes React, CSS o librerías de UI (MUI, etc.).
*   **Seguridad**: Prohibido el uso de `any`, `LDAP`, `Implicit Flow` en OAuth, o almacenamiento de tokens en `localStorage`.
*   **Desarrollo**: Prohibido ejecutar consultas Prisma directamente en las rutas, o procesar tareas pesadas (PDFs/Excels) de forma síncrona.
*   **Integridad**: Prohibido el borrado físico de registros (`DELETE`), el uso de `Float` para dinero, o versionar archivos de secretos (`.env`, `vars.ts`).
*   **Calidad**: Prohibido silenciar errores de **ESLint** o **TypeScript** sin justificación documentada. No mezclar gestores de paquetes (`yarn.lock` único).