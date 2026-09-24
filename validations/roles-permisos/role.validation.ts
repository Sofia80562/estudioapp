import { z } from 'zod';

export const roleListQuerySchema = z
	.object({
		organizationId: z.string().uuid(),
		page: z.coerce.number().int().min(1).default(1),
		pageSize: z.coerce.number().int().min(1).max(100).default(20),
		search: z.string().trim().max(200).optional(),
	})
	.strict();

export const createRoleSchema = z
	.object({
		name: z.string().trim().min(2).max(100),
		description: z.string().trim().max(500).optional(),
		permissionIds: z.array(z.string().uuid()),
	})
	.strict();

export const updateRoleSchema = z
	.object({
		name: z.string().trim().min(2).max(100).optional(),
		description: z.string().trim().max(500).optional(),
		permissionIds: z.array(z.string().uuid()).optional(),
		expectedUpdatedAt: z.string().datetime({ offset: true }),
	})
	.strict();

export type RoleListQuery = z.infer<typeof roleListQuerySchema>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;