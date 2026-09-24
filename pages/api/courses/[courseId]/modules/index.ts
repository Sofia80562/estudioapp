import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { AuthenticationError } from '@/errors';
import { auth } from '@/middleware/auth';
import { access } from '@/middleware/access';
import { routerOptions } from '@/lib/api/router-config';
import { sectionService } from '@/services/courses';
import {
    sectionCollectionParams,
    createSectionSchema,
} from '@/validations/courses';
import { throwValidationError } from '@/lib/errors/throw-validation-error';

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler
    .use(auth)
    .get(access('courses.read'), async (req, res): Promise<void> => {
        if (!req.user) throw new AuthenticationError();
        const parsedParams = sectionCollectionParams.safeParse(req.query);

        if (!parsedParams.success) {
            throwValidationError(parsedParams);
            return;
        }

        // Pasamos directamente req.query o parsedParams.data como filtros de paginación/búsqueda
        const result = await sectionService.getAll(
            parsedParams.data.courseId,
            req.query as any, 
            req.user,
        );

        res.status(200).json(result);
    })
    .post(access('courses.manage'), async (req, res): Promise<void> => {
        if (!req.user) throw new AuthenticationError();
        const parsedParams = sectionCollectionParams.safeParse(req.query);
        const parsedBody = createSectionSchema.safeParse(req.body);

        if (!parsedParams.success) {
            throwValidationError(parsedParams);
            return;
        }
        if (!parsedBody.success) {
            throwValidationError(parsedBody);
            return;
        }

        const section = await sectionService.create(
            parsedParams.data.courseId,
            parsedBody.data,
            req.user,
        );

        res.status(201).json({ data: section });
    });

export default handler.handler(routerOptions);