import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { auth } from '@/middleware/auth';
import { access } from '@/middleware/access';
import { routerOptions } from '@/lib/api/router-config';
import { studySessionService } from '@/services/study-sessions';
import { createStudySessionSchema, studySessionQuerySchema } from '@/validations/study-sessions';
import { throwValidationError } from '@/lib/errors/throw-validation-error';
import { AuthenticationError } from '@/errors/auth';

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler
	.use(auth)
	.get(access('study-sessions.read'), async (req, res): Promise<void> => {
		const parsedQuery = studySessionQuerySchema.safeParse(req.query);
		throwValidationError(parsedQuery);

		const result = await studySessionService.getAll(
			parsedQuery.data.page,
			parsedQuery.data.pageSize,
		);

		res.status(200).json({
			data: result.sessions,
			meta: result.meta,
		});
	})
	.post(access('study-sessions.manage'), async (req, res): Promise<void> => {
		const parsedBody = createStudySessionSchema.safeParse(req.body);
		throwValidationError(parsedBody);

		if (!req.user) {
			throw new AuthenticationError();
		}

		const newSession = await studySessionService.create(parsedBody.data, req.user.id);

		res.status(201).json({
			data: newSession,
		});
	});

export default handler.handler(routerOptions);