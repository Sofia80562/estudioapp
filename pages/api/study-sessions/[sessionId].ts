import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { auth } from '@/middleware/auth';
import { access } from '@/middleware/access';
import { routerOptions } from '@/lib/api/router-config';
import { studySessionService } from '@/services/study-sessions';
import { studySessionParamsSchema } from '@/validations/study-sessions';
import { throwValidationError } from '@/lib/errors/throw-validation-error';

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler
	.use(auth)
	.get(access('study-sessions.read'), async (req, res): Promise<void> => {
		const parsed = studySessionParamsSchema.safeParse({ sessionId: req.query.sessionId });
		throwValidationError(parsed);

		const session = await studySessionService.getById(parsed.data.sessionId);

		res.status(200).json({ data: session });
	})
	.delete(access('study-sessions.manage'), async (req, res): Promise<void> => {
		const parsed = studySessionParamsSchema.safeParse({ sessionId: req.query.sessionId });
		throwValidationError(parsed);

		await studySessionService.delete(parsed.data.sessionId);

		res.status(204).end();
	});

export default handler.handler(routerOptions);