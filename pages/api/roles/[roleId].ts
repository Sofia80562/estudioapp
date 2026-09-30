import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { AuthenticationError } from '@/errors';
import { routerOptions } from '@/lib/api/router-config';
import { throwValidationError } from '@/lib/errors/throw-validation-error';
import { access } from '@/middleware/access';
import { auth } from '@/middleware/auth';
import { roleService } from '@/services/roles-permisos/role.service';
import {
	roleParamsSchema,
	updateRoleSchema,
} from '@/validations/roles-permisos/role.validation';

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler
	.use(auth)
	.get(access('roles.read'), async (req, res): Promise<void> => {
		if (!req.user) throw new AuthenticationError();
		
		const params = roleParamsSchema.parse(req.query); // Usar .parse() infiere directamente el tipo y evita el error de unknown

		const role = await roleService.getRoleById(
			params.roleId,
			params.organizationId,
			req.user,
		);
		res.status(200).json({ data: role });
	})
	.patch(access('roles.manage'), async (req, res): Promise<void> => {
		if (!req.user) throw new AuthenticationError();
		
		const params = roleParamsSchema.parse(req.query);
		const body = updateRoleSchema.parse(req.body); // Usando updateRoleSchema y .parse()

		const role = await roleService.updateRole(
			params.roleId,
			params.organizationId,
			body,
			req.user,
		);
		res.status(200).json({ data: role });
	})
	.delete(access('roles.manage'), async (req, res): Promise<void> => {
		if (!req.user) throw new AuthenticationError();
		
		const params = roleParamsSchema.parse(req.query);

		await roleService.deleteRole(params.roleId, params.organizationId, req.user);
		res.status(204).end();
	});

export default handler.handler(routerOptions);