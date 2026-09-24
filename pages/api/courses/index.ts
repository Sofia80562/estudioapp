import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { auth } from '@/middleware/auth';
import { access } from '@/middleware/access';
import { routerOptions } from '@/lib/api/router-config';
import { courseService } from '@/services/courses';
import {
	courseQuerySchema,
	createCourseSchema,
} from '@/validations/courses';
import { throwValidationError } from '@/lib/errors/throw-validation-error';
import { AuthenticationError } from '@/errors';

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler
	.use(auth)
	.get(access('courses.read'), async (req, res): Promise<void> => {
		if (!req.user) throw new AuthenticationError();
		const parsed = courseQuerySchema.safeParse(req.query);
		throwValidationError(parsed);

		const result = await courseService.getAll(parsed.data, req.user);

		res.status(200).json(result);
	})
	.post(access('courses.manage'), async (req, res): Promise<void> => {
		if (!req.user) throw new AuthenticationError();
		const parsed = createCourseSchema.safeParse(req.body);
		throwValidationError(parsed);

		const course = await courseService.create(parsed.data, req.user);

		res.status(201).json({ data: course });
	});

export default handler.handler(routerOptions);