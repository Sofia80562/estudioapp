import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { auth } from '@/middleware/auth';
import { access } from '@/middleware/access';
import { routerOptions } from '@/lib/api/router-config';
import { institucionService } from '@/services/instituciones';
import { campusQuerySchema, institucionParamsSchema } from '@/validations/instituciones';
import { throwValidationError } from '@/lib/errors/throw-validation-error';

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler
	.use(auth)
	.get(access('instituciones.read'), async (req, res): Promise<void> => {
		const parsedParams = institucionParamsSchema.safeParse({ institucionId: req.query.institucionId });
		const parsedQuery = campusQuerySchema.safeParse(req.query);

		throwValidationError(parsedParams);
		throwValidationError(parsedQuery);

		const result = await institucionService.getCampusByInstitucionId(
			parsedParams.data.institucionId,
			parsedQuery.data.page,
			parsedQuery.data.pageSize,
		);

		res.status(200).json({
			data: result.campus,
			meta: result.meta,
		});
	});

export default handler.handler(routerOptions);