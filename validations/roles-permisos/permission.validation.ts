import { z } from 'zod';

export const updateRolePermissionsSchema = z.object({
    permissionIds: z
        .array(z.string().uuid())
        .refine((ids) => new Set(ids).size === ids.length, {
            message: 'No se permiten IDs de permisos duplicados.',
        }),
    expectedUpdatedAt: z.string().datetime(),
}).strict();