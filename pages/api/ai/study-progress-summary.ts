import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

import { AuthenticationError } from '@/errors';
import { routerOptions } from '@/lib/api/router-config';
import { auth } from '@/middleware/auth';
import { access } from '@/middleware/access';

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler
	.use(auth)
	.get(access('ai.read'), async (req, res): Promise<void> => {
		if (!req.user) {
			throw new AuthenticationError();
		}

		// Lógica simulada o llamada al servicio de IA para el resumen de progreso
		res.status(200).json({
			data: {
				summary: "Progreso de estudio analizado correctamente.",
				completedSessions: 5,
				totalHours: 12.5,
			},
		});
	});

export default handler.handler(routerOptions);