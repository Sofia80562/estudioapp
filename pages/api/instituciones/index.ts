import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { auth } from '@/middleware/auth';
import { access } from '@/middleware/access';
import { routerOptions } from '@/lib/api/router-config';
import { institucionService } from '@/services/instituciones';
import { createInstitucionSchema, institucionQuerySchema } from '@/validations/instituciones';
import { throwValidationError } from '@/lib/errors/throw-validation-error';
import { AuthenticationError } from '@/errors/auth';

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler
	.use(auth)
	.get(access('instituciones.read'), async (req, res): Promise<void> => {
		const parsedQuery = institucionQuerySchema.safeParse(req.query);
		throwValidationError(parsedQuery);

		const result = await institucionService.getAll(
			parsedQuery.data.page,
			parsedQuery.data.pageSize,
		);

		res.status(200).json({
			data: result.instituciones,
			meta: result.meta,
		});
	})
	.post(access('instituciones.manage'), async (req, res): Promise<void> => {
		const parsedBody = createInstitucionSchema.safeParse(req.body);
		throwValidationError(parsedBody);

		if (!req.user) {
			throw new AuthenticationError();
		}

		const newInstitucion = await institucionService.create({
			name: parsedBody.data.nombre,
			siglas: parsedBody.data.siglas,
		});

		res.status(201).json({
			data: newInstitucion,
		});
	});

export default handler.handler(routerOptions);