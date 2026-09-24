import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { AuthenticationError } from '@/errors';
import { auth } from '@/middleware/auth';
import { access } from '@/middleware/access';
import { routerOptions } from '@/lib/api/router-config';
import { courseService } from '@/services/courses';
import {
    courseParamsSchema,
    updateCourseSchema,
} from '@/validations/courses';
import { throwValidationError } from '@/lib/errors/throw-validation-error';

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler
    .use(auth)
    .get(access('courses.read'), async (req, res): Promise<void> => {
        if (!req.user) throw new AuthenticationError();
        const parsed = courseParamsSchema.safeParse(req.query);
        throwValidationError(parsed);

        // Se usa 'as any' o 'as z.infer<...>' para evitar el tipo unknown de safeParse
        const data = parsed.data as { courseId: string };
        const course = await courseService.getById(data.courseId, req.user);

        res.status(200).json({ data: course });
    })
    .patch(access('courses.manage'), async (req, res): Promise<void> => {
        if (!req.user) throw new AuthenticationError();
        const parsedParams = courseParamsSchema.safeParse(req.query);
        const parsedBody = updateCourseSchema.safeParse(req.body);

        throwValidationError(parsedParams);
        throwValidationError(parsedBody);

        const paramsData = parsedParams.data as { courseId: string };
        const bodyData = parsedBody.data as any;

        const course = await courseService.update(
            paramsData.courseId,
            bodyData,
            req.user,
        );

        res.status(200).json({ data: course });
    })
    .delete(access('courses.manage'), async (req, res): Promise<void> => {
        if (!req.user) throw new AuthenticationError();
        const parsed = courseParamsSchema.safeParse(req.query);
        throwValidationError(parsed);

        const data = parsed.data as { courseId: string };
        await courseService.remove(data.courseId, req.user);

        res.status(204).end();
    });

export default handler.handler(routerOptions);