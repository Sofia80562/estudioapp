import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { AuthenticationError } from '@/errors';
import { auth } from '@/middleware/auth';
import { access } from '@/middleware/access';
import { routerOptions } from '@/lib/api/router-config';
import * as service from '@/services/tasks';
import { taskParamsSchema } from '@/validations/tasks';
import { throwValidationError } from '@/lib/errors/throw-validation-error';

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler.use(auth).delete(access('tasks.delete.own'), async (req, res): Promise<void> => {
	if (!req.user) throw new AuthenticationError();
	
	const params = taskParamsSchema.safeParse(req.query);
	throwValidationError(params);
	
	await service.deleteOwnTask(params.data.taskId, req.user);
	
	res.status(204).end();
});

export default handler.handler(routerOptions);