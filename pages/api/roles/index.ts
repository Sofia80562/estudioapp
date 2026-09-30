import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { AuthenticationError } from '@/errors';
import { routerOptions } from '@/lib/api/router-config';
import { access } from '@/middleware/access';
import { auth } from '@/middleware/auth';
import { roleService } from '@/services/roles-permisos/role.service';
import {
	createRoleSchema,
	roleListQuerySchema,
} from '@/validations/roles-permisos/role.validation';

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler
	.use(auth)
	.get(access('roles.read'), async (req, res): Promise<void> => {
		if (!req.user) throw new AuthenticationError();

		const parsed = roleListQuerySchema.parse(req.query);
		const result = await roleService.getRoles(parsed, req.user);

		res.status(200).json({
			data: result.roles,
			meta: {
				page: result.page,
				pageSize: result.pageSize,
				total: result.total,
				totalPages: Math.ceil(result.total / result.pageSize),
			},
		});
	})
	.post(access('roles.manage'), async (req, res): Promise<void> => {
		if (!req.user) throw new AuthenticationError();

		const query = roleListQuerySchema.pick({ organizationId: true }).strict().parse(req.query);
		const body = createRoleSchema.parse(req.body);

		const role = await roleService.createRole(query.organizationId, body, req.user);
		res.status(201).json({ data: role });
	});

export default handler.handler(routerOptions);