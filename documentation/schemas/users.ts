import { z } from 'zod';

import { registry } from '@/documentation/registry';
import { ErrorResponseSchema, PaginationMetaSchema } from '@/documentation/responses/common';

const EXAMPLE_UUID = '123e4567-e89b-12d3-a456-426614174000';

const userIdParam = {
    name: 'userId',
    in: 'path' as const,
    required: true,
    schema: { type: 'string' as const, format: 'uuid' },
    example: EXAMPLE_UUID,
};

export const UserRoleSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    organizationId: z.string().uuid().nullable(),
});

export const UserResponseSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    active: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().optional(),
    roles: z.array(UserRoleSchema).optional(),
});

export const CreateUserBodySchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    organizationId: z.string().uuid(),
    roleIds: z.array(z.string().uuid()).optional(),
});

export const UpdateUserBodySchema = z.object({
    email: z.string().email().optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    organizationId: z.string().uuid().optional(),
    roleIds: z.array(z.string().uuid()).optional(),
});

export const AdminUserProfileSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    active: z.boolean(),
    profileUpdatedAt: z.string().datetime(),
});

export const UpdateAdminUserProfileBodySchema = z
    .object({
        firstName: z.string().trim().min(1).max(100).optional(),
        lastName: z.string().trim().min(1).max(100).optional(),
        expectedProfileUpdatedAt: z.string().datetime(),
    })
    .strict();

export const UserListResponseSchema = z.object({
    data: z.array(UserResponseSchema),
    meta: PaginationMetaSchema,
});

registry.register('UserResponse', UserResponseSchema as any);
registry.register('UserRole', UserRoleSchema as any);
registry.register('CreateUserBody', CreateUserBodySchema as any);
registry.register('UpdateUserBody', UpdateUserBodySchema as any);
registry.register('AdminUserProfile', AdminUserProfileSchema as any);
registry.register('UpdateAdminUserProfileBody', UpdateAdminUserProfileBodySchema as any);
registry.register('UserListResponse', UserListResponseSchema as any);

export const OwnProfileSchema = z.object({
    phone: z.string().nullable(),
    facebookUrl: z.string().url().nullable(),
    instagramUrl: z.string().url().nullable(),
    linkedinUrl: z.string().url().nullable(),
    xUrl: z.string().url().nullable(),
    githubUrl: z.string().url().nullable(),
    tiktokUrl: z.string().url().nullable(),
    websiteUrl: z.string().url().nullable(),
    hasAvatar: z.boolean(),
    avatarUpdatedAt: z.string().datetime().nullable(),
    profileUpdatedAt: z.string().datetime(),
});

export const UpdateOwnProfileBodySchema = z
    .object({
        phone: z.string().nullable().optional(),
        facebookUrl: z.string().url().nullable().optional(),
        instagramUrl: z.string().url().nullable().optional(),
        linkedinUrl: z.string().url().nullable().optional(),
        xUrl: z.string().url().nullable().optional(),
        githubUrl: z.string().url().nullable().optional(),
        tiktokUrl: z.string().url().nullable().optional(),
        websiteUrl: z.string().url().nullable().optional(),
        expectedProfileUpdatedAt: z.string().datetime(),
    })
    .strict();

export const UpdateOwnAvatarBodySchema = z.object({
    imageBase64: z.string(),
    mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
});

registry.register('OwnProfile', OwnProfileSchema as any);
registry.register('UpdateOwnProfileBody', UpdateOwnProfileBodySchema as any);
registry.register('UpdateOwnAvatarBody', UpdateOwnAvatarBodySchema as any);

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
        description: 'Usuario no encontrado',
        content: {
            'application/json': {
                schema: ErrorResponseSchema as any,
            },
        },
    },
    409: {
        description:
            'Conflicto: el recurso ya existe, o la operación dejaría la plataforma sin ningún administrador activo',
        content: {
            'application/json': {
                schema: ErrorResponseSchema as any,
            },
        },
    },
    422: {
        description: 'Rol inexistente, eliminado o perteneciente a otra organización',
        content: {
            'application/json': {
                schema: ErrorResponseSchema as any,
            },
        },
    },
};

registry.registerPath({
    method: 'get',
    path: '/users',
    tags: ['Users'],
    security: [{ cookieAuth: [] }],
    description: 'Obtiene una lista paginada de usuarios. Requiere permiso `users.read`.',
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
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Búsqueda por nombre o email',
        },
        {
            name: 'active',
            in: 'query',
            schema: { type: 'boolean' },
            description: 'Filtrar por estado activo',
        },
        {
            name: 'orderBy',
            in: 'query',
            schema: { type: 'string', enum: ['name', 'email', 'createdAt'] },
            description: 'Campo para ordenamiento',
        },
        {
            name: 'order',
            in: 'query',
            schema: { type: 'string', enum: ['asc', 'desc'] },
            description: 'Dirección del ordenamiento',
        },
    ],
    responses: {
        200: {
            description: 'Lista de usuarios',
            content: {
                'application/json': {
                    schema: UserListResponseSchema as any,
                },
            },
        },
        ...errorResponses,
    },
});

registry.registerPath({
    method: 'post',
    path: '/users',
    tags: ['Users'],
    security: [{ cookieAuth: [] }],
    description:
        'Crea un nuevo usuario. Requiere permiso `users.create`. Puede asignar roles al crear. ' +
        'Si `roleIds` incluye un rol de sistema (`isSystem: true`, como `Administrador`), responde `403` a menos que quien hace la petición ya tenga asignado el rol `Administrador`.',
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: CreateUserBodySchema as any,
                example: {
                    email: 'juan.perez@ejemplo.com',
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    organizationId: '123e4567-e89b-12d3-a456-426614174000',
                    roleIds: ['123e4567-e89b-12d3-a456-426614174001'],
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Usuario creado',
            content: {
                'application/json': {
                    schema: z.object({
                        data: UserResponseSchema,
                    }) as any,
                },
            },
        },
        ...errorResponses,
    },
});

registry.registerPath({
    method: 'get',
    path: '/users/{userId}',
    tags: ['Users'],
    security: [{ cookieAuth: [] }],
    description: 'Obtiene un usuario por ID. Requiere permiso `users.read`.',
    parameters: [userIdParam],
    responses: {
        200: {
            description: 'Usuario encontrado',
            content: {
                'application/json': {
                    schema: z.object({
                        data: UserResponseSchema,
                    }) as any,
                },
            },
        },
        ...errorResponses,
    },
});

registry.registerPath({
    method: 'patch',
    path: '/users/{userId}',
    tags: ['Users'],
    security: [{ cookieAuth: [] }],
    description:
        'Actualiza un usuario. Requiere permiso `users.update`. Puede actualizar roles con roleIds ' +
        '(reemplaza todos los roles previos). Si el reemplazo incluye un rol de sistema, responde `403` salvo que quien hace la petición sea `Administrador`. ' +
        'Si el reemplazo remueve el rol `Administrador` del único administrador activo, responde `409`.',
    parameters: [userIdParam],
    requestBody: {
        required: false,
        content: {
            'application/json': {
                schema: UpdateUserBodySchema as any,
                example: {
                    firstName: 'Juan Carlos',
                    lastName: 'Pérez García',
                    roleIds: ['123e4567-e89b-12d3-a456-426614174001'],
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Usuario actualizado',
            content: {
                'application/json': {
                    schema: z.object({
                        data: UserResponseSchema,
                    }) as any,
                },
            },
        },
        ...errorResponses,
    },
});

registry.registerPath({
    method: 'delete',
    path: '/users/{userId}',
    tags: ['Users'],
    security: [{ cookieAuth: [] }],
    description:
        'Elimina (soft delete) un usuario. Requiere permiso `users.delete`. ' +
        'Responde `409` si el usuario es el único activo con el rol global `Administrador` asignado.',
    parameters: [userIdParam],
    responses: {
        204: {
            description: 'Usuario eliminado',
        },
        ...errorResponses,
    },
});

const ownProfileErrorResponses = {
    400: errorResponses[400],
    401: errorResponses[401],
    409: {
        description: 'El perfil fue modificado concurrentemente',
        content: { 'application/json': { schema: ErrorResponseSchema as any } },
    },
    500: {
        description: 'Error interno controlado',
        content: { 'application/json': { schema: ErrorResponseSchema as any } },
    },
};

registry.registerPath({
    method: 'get',
    path: '/profile',
    tags: ['Profile'],
    security: [{ cookieAuth: [] }],
    description: 'Obtiene los datos opcionales del perfil del usuario autenticado.',
    responses: {
        200: {
            description: 'Perfil propio',
            content: { 'application/json': { schema: z.object({ data: OwnProfileSchema }) as any } },
        },
        ...ownProfileErrorResponses,
    },
});

registry.registerPath({
    method: 'patch',
    path: '/profile',
    tags: ['Profile'],
    security: [{ cookieAuth: [] }],
    description:
        'Actualiza parcialmente solo campos opcionales del perfil autenticado. Usa control optimista mediante expectedProfileUpdatedAt.',
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: UpdateOwnProfileBodySchema as any,
                example: {
                    phone: '+593999999999',
                    expectedProfileUpdatedAt: '2026-08-21T12:00:00.000Z',
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Perfil actualizado',
            content: { 'application/json': { schema: z.object({ data: OwnProfileSchema }) as any } },
        },
        ...ownProfileErrorResponses,
    },
});

registry.registerPath({
    method: 'get',
    path: '/profile/avatar',
    tags: ['Profile'],
    security: [{ cookieAuth: [] }],
    description: 'Devuelve el avatar WebP del usuario autenticado con caché privada y nosniff.',
    responses: {
        200: {
            description: 'Avatar normalizado',
            content: { 'image/webp': { schema: { type: 'string', format: 'binary' } as any } },
        },
        401: errorResponses[401],
        404: errorResponses[404],
        500: ownProfileErrorResponses[500],
    },
});

registry.registerPath({
    method: 'put',
    path: '/profile/avatar',
    tags: ['Profile'],
    security: [{ cookieAuth: [] }],
    description:
        'Reemplaza el avatar propio. Acepta JPEG, PNG o WebP de hasta 2 MiB, valida el contenido real y lo normaliza a WebP de máximo 1024×1024.',
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: UpdateOwnAvatarBodySchema as any,
                example: {
                    imageBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                    mimeType: 'image/png',
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Avatar actualizado',
            content: {
                'application/json': {
                    schema: z.object({ data: z.object({ avatarUpdatedAt: z.string().datetime() }) }) as any,
                },
            },
        },
        400: errorResponses[400],
        401: errorResponses[401],
        413: {
            description: 'La imagen supera 2 MiB',
            content: { 'application/json': { schema: ErrorResponseSchema as any } },
        },
        415: {
            description: 'MIME no permitido, contenido discordante o imagen corrupta',
            content: { 'application/json': { schema: ErrorResponseSchema as any } },
        },
        422: {
            description: 'La imagen no pudo procesarse de forma segura',
            content: { 'application/json': { schema: ErrorResponseSchema as any } },
        },
        500: ownProfileErrorResponses[500],
    },
});

registry.registerPath({
    method: 'delete',
    path: '/profile/avatar',
    tags: ['Profile'],
    security: [{ cookieAuth: [] }],
    description: 'Elimina de forma idempotente el avatar del usuario autenticado.',
    responses: {
        204: { description: 'Avatar eliminado o ya inexistente' },
        401: errorResponses[401],
        500: ownProfileErrorResponses[500],
    },
});

registry.registerPath({
    method: 'get',
    path: '/users/{userId}/profile',
    tags: ['Users'],
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    description:
        'Obtiene el perfil mínimo para edición administrativa. Requiere `users.read`; no expone credenciales, identificación, roles ni permisos.',
    parameters: [userIdParam],
    responses: {
        200: {
            description: 'Perfil administrativo encontrado',
            content: {
                'application/json': {
                    schema: z.object({ data: AdminUserProfileSchema }) as any,
                },
            },
        },
        ...errorResponses,
    },
});

registry.registerPath({
    method: 'patch',
    path: '/users/{userId}/profile',
    tags: ['Users'],
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    description:
        'Actualiza únicamente firstName/lastName con control optimista. Requiere `users.update`. Rechaza campos desconocidos, usuarios inactivos, conflictos concurrentes y la edición de usuarios con roles de sistema por actores no Administrador.',
    parameters: [userIdParam],
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: UpdateAdminUserProfileBodySchema as any,
                example: {
                    firstName: 'María José',
                    lastName: 'Núñez',
                    expectedProfileUpdatedAt: '2026-08-21T12:00:00.000Z',
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Perfil actualizado',
            content: {
                'application/json': {
                    schema: z.object({ data: AdminUserProfileSchema }) as any,
                },
            },
        },
        ...errorResponses,
    },
});

registry.registerPath({
    method: 'get',
    path: '/users/{userId}/roles',
    tags: ['UserRoles'],
    security: [{ cookieAuth: [] }],
    description: 'Obtiene los roles asignados a un usuario. Requiere permiso `users.read`.',
    parameters: [
        userIdParam,
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
    ],
    responses: {
        200: {
            description: 'Roles del usuario',
            content: {
                'application/json': {
                    schema: z.object({
                        data: z.array(UserRoleSchema),
                        meta: PaginationMetaSchema,
                    }) as any,
                },
            },
        },
        ...errorResponses,
    },
});

const AssignUserRolesBodySchema = z.object({
    roleIds: z.array(z.string().uuid()),
});

registry.registerPath({
    method: 'post',
    path: '/users/{userId}/roles',
    tags: ['UserRoles'],
    security: [{ cookieAuth: [] }],
    description:
        'Asigna nuevos roles a un usuario. Requiere permiso `users.manage`. ' +
        'Si `roleIds` incluye un rol de sistema (`isSystem: true`, como `Administrador`), responde `403` a menos que quien hace la petición ya tenga asignado el rol `Administrador`.',
    parameters: [userIdParam],
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: AssignUserRolesBodySchema as any,
                example: {
                    roleIds: ['123e4567-e89b-12d3-a456-426614174001'],
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Roles asignados',
            content: {
                'application/json': {
                    schema: z.object({
                        data: z.array(UserRoleSchema),
                    }) as any,
                },
            },
        },
        ...errorResponses,
    },
});

const roleIdParam = {
    name: 'roleId',
    in: 'path' as const,
    required: true,
    schema: { type: 'string' as const, format: 'uuid' },
    example: '123e4567-e89b-12d3-a456-426614174001',
};

registry.registerPath({
    method: 'delete',
    path: '/users/{userId}/roles/{roleId}',
    tags: ['UserRoles'],
    security: [{ cookieAuth: [] }],
    description:
        'Remueve un rol de un usuario. Requiere permiso `users.manage`. ' +
        'Responde `409` si el rol removido es el rol global `Administrador` y el usuario es el único activo que lo tiene asignado.',
    parameters: [userIdParam, roleIdParam],
    responses: {
        204: {
            description: 'Rol removido',
        },
        ...errorResponses,
    },
});