import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { AuthenticationError } from '@/errors';
import { auth } from '@/middleware/auth';
import { access } from '@/middleware/access';
import { routerOptions } from '@/lib/api/router-config';
import { sectionService } from '@/services/courses';
import { sectionParamsSchema, updateSectionSchema } from '@/validations/courses';
import { throwValidationError } from '@/lib/errors/throw-validation-error';

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler
    .use(auth)
    .get(access('courses.read'), async (req, res): Promise<void> => {
        if (!req.user) throw new AuthenticationError();
        const parsed = sectionParamsSchema.safeParse(req.query);
        throwValidationError(parsed);

        // sectionService.getById solo recibe 2 argumentos: (sectionId, actingUser)
        const section = await sectionService.getById(
            parsed.data.sectionId,
            req.user,
        );

        res.status(200).json({ data: section });
    })
    .patch(access('courses.manage'), async (req, res): Promise<void> => {
        if (!req.user) throw new AuthenticationError();
        const parsedParams = sectionParamsSchema.safeParse(req.query);
        const parsedBody = updateSectionSchema.safeParse(req.body);

        throwValidationError(parsedParams);
        throwValidationError(parsedBody);

        // sectionService.update solo recibe 3 argumentos: (sectionId, data, actingUser)
        const section = await sectionService.update(
            parsedParams.data.sectionId,
            parsedBody.data,
            req.user,
        );

        res.status(200).json({ data: section });
    })
    .delete(access('courses.manage'), async (req, res): Promise<void> => {
        if (!req.user) throw new AuthenticationError();
        const parsed = sectionParamsSchema.safeParse(req.query);
        throwValidationError(parsed);

        // sectionService.remove solo recibe 2 argumentos: (sectionId, actingUser)
        await sectionService.remove(parsed.data.sectionId, req.user);

        res.status(204).end();
    });

export default handler.handler(routerOptions);