import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { AuthenticationError } from '@/errors';
import { auth } from '@/middleware/auth';
import { access } from '@/middleware/access';
import { routerOptions } from '@/lib/api/router-config';
import * as service from '@/services/tasks';
import { createTaskSchema, paginationSchema } from '@/validations/tasks';
import { throwValidationError } from '@/lib/errors/throw-validation-error';

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler
	.use(auth)
	.get(access('tasks.read.own'), async (req, res): Promise<void> => {
		if (!req.user) throw new AuthenticationError();
		
		const query = paginationSchema.safeParse(req.query);
		throwValidationError(query);
		
		const tasks = await service.listOwnTasks(
			req.user.id, 
			query.data.page, 
			query.data.pageSize
		);
		
		res.status(200).json(tasks);
	})
	.post(access('tasks.create'), async (req, res): Promise<void> => {
		if (!req.user) throw new AuthenticationError();
		
		const body = createTaskSchema.safeParse(req.body);
		throwValidationError(body);
		
		const result = await service.createTask(body.data, req.user);
		
		res.status(201).json({ data: result.task });
	});

export default handler.handler(routerOptions);