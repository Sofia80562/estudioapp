import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { AuthenticationError } from '@/errors';
import { routerOptions } from '@/lib/api/router-config';
import { access } from '@/middleware/access';
import { auth } from '@/middleware/auth';
import { roleService } from '@/services/roles-permisos/role.service';
import { updateRolePermissionsSchema } from '@/validations/roles-permisos/permission.validation';
import { roleParamsSchema } from '@/validations/roles-permisos/role.validation';

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler
	.use(auth)
	.get(access('roles.read'), async (req, res): Promise<void> => {
		if (!req.user) throw new AuthenticationError();
		
		// Usamos roleParamsSchema o el esquema de parámetros disponible que valide roleId y query params de paginación
		const query = roleParamsSchema.parse(req.query);

		const result = await roleService.getRolePermissions(
			query.roleId,
			query.organizationId,
			Number(req.query.page) || 1,
			Number(req.query.pageSize) || 10,
			req.user,
		);

		res.status(200).json({
			data: result.permissions,
			meta: {
				page: result.page,
				pageSize: result.pageSize,
				total: result.total,
				totalPages: Math.ceil(result.total / result.pageSize),
			},
		});
	})
	.patch(access('roles.manage'), async (req, res): Promise<void> => {
		if (!req.user) throw new AuthenticationError();
		
		const query = roleParamsSchema.parse(req.query);
		const body = updateRolePermissionsSchema.parse(req.body);

		const role = await roleService.updateRole(
			query.roleId,
			query.organizationId,
			body,
			req.user,
		);
		res.status(200).json({ data: role });
	});

export default handler.handler(routerOptions);