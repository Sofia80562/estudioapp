import { z } from 'zod';

import { registry } from '@/documentation/registry';
import { ErrorResponseSchema, PaginationMetaSchema } from '@/documentation/responses/common';

const EXAMPLE_UUID = '123e4567-e89b-12d3-a456-426614174000';

const taskIdParam = {
    name: 'taskId',
    in: 'path' as const,
    required: true,
    schema: { type: 'string' as const, format: 'uuid' },
    example: EXAMPLE_UUID,
};

export const TaskResponseSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable(),
    completed: z.boolean(),
    dueDate: z.string().datetime().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().optional(),
});

export const CreateTaskBodySchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().max(1000).nullable().optional(),
    dueDate: z.string().datetime().nullable().optional(),
});

export const UpdateTaskBodySchema = z
    .object({
        title: z.string().min(1).max(255).optional(),
        description: z.string().max(1000).nullable().optional(),
        completed: z.boolean().optional(),
        dueDate: z.string().datetime().nullable().optional(),
    })
    .strict();

export const TaskListResponseSchema = z.object({
    data: z.array(TaskResponseSchema),
    meta: PaginationMetaSchema,
});

registry.register('TaskResponse', TaskResponseSchema as any);
registry.register('CreateTaskBody', CreateTaskBodySchema as any);
registry.register('UpdateTaskBody', UpdateTaskBodySchema as any);
registry.register('TaskListResponse', TaskListResponseSchema as any);

const errorResponses = {
    400: {
        description: 'Solicitud inválida',
        content: {
            'application/json': {
                schema: ErrorResponseSchema as any,
            },
        },
    },
    401: {
        description: 'No autenticado',
        content: {
            'application/json': {
                schema: ErrorResponseSchema as any,
            },
        },
    },
    403: {
        description: 'Permisos insuficientes',
        content: {
            'application/json': {
                schema: ErrorResponseSchema as any,
            },
        },
    },
    404: {
        description: 'Tarea no encontrada',
        content: {
            'application/json': {
                schema: ErrorResponseSchema as any,
            },
        },
    },
};

registry.registerPath({
    method: 'get',
    path: '/tasks',
    tags: ['Tasks'],
    security: [{ cookieAuth: [] }],
    description: 'Obtiene una lista paginada de tareas del usuario autenticado.',
    parameters: [
        {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1 },
            description: 'Número de página (default: 1)',
        },
        {
            name: 'pageSize',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100 },
            description: 'Registros por página (default: 20)',
        },
        {
            name: 'completed',
            in: 'query',
            schema: { type: 'boolean' },
            description: 'Filtrar por estado de completado',
        },
        {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Búsqueda por título',
        },
    ],
    responses: {
        200: {
            description: 'Lista de tareas',
            content: {
                'application/json': {
                    schema: TaskListResponseSchema as any,
                },
            },
        },
        ...errorResponses,
    },
});

registry.registerPath({
    method: 'post',
    path: '/tasks',
    tags: ['Tasks'],
    security: [{ cookieAuth: [] }],
    description: 'Crea una nueva tarea para el usuario autenticado.',
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: CreateTaskBodySchema as any,
                example: {
                    title: 'Estudiar para el examen de bases de datos',
                    description: 'Revisar normalización y vistas en MariaDB',
                    dueDate: '2026-10-01T10:00:00.000Z',
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Tarea creada',
            content: {
                'application/json': {
                    schema: z.object({
                        data: TaskResponseSchema,
                    }) as any,
                },
            },
        },
        ...errorResponses,
    },
});

registry.registerPath({
    method: 'get',
    path: '/tasks/{taskId}',
    tags: ['Tasks'],
    security: [{ cookieAuth: [] }],
    description: 'Obtiene el detalle de una tarea específica por su ID.',
    parameters: [taskIdParam],
    responses: {
        200: {
            description: 'Tarea encontrada',
            content: {
                'application/json': {
                    schema: z.object({
                        data: TaskResponseSchema,
                    }) as any,
                },
            },
        },
        ...errorResponses,
    },
});

registry.registerPath({
    method: 'patch',
    path: '/tasks/{taskId}',
    tags: ['Tasks'],
    security: [{ cookieAuth: [] }],
    description: 'Actualiza parcialmente una tarea existente.',
    parameters: [taskIdParam],
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: UpdateTaskBodySchema as any,
                example: {
                    completed: true,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Tarea actualizada',
            content: {
                'application/json': {
                    schema: z.object({
                        data: TaskResponseSchema,
                    }) as any,
                },
            },
        },
        ...errorResponses,
    },
});

registry.registerPath({
    method: 'delete',
    path: '/tasks/{taskId}',
    tags: ['Tasks'],
    security: [{ cookieAuth: [] }],
    description: 'Elimina una tarea del sistema.',
    parameters: [taskIdParam],
    responses: {
        204: {
            description: 'Tarea eliminada correctamente',
        },
        ...errorResponses,
    },
});