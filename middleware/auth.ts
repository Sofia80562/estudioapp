import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextHandler } from 'next-connect';

import { AuthenticationError } from '@/errors/auth';
import { env } from '@/lib/config/env';
import { decrypt } from '@/lib/session';
import type { SessionPayload } from '@/lib/session';
import { sessionService } from '@/services/auth/session.service';

export const auth = async (
	req: NextApiRequest,
	_res: NextApiResponse,
	next: NextHandler,
): Promise<void> => {
	if (env.NODE_ENV !== 'production' && env.BYPASS_AUTH) {
		const session: SessionPayload = {
			sessionId: 'dev-session',
			user: {
				id: 'dev-user',
				email: 'dev@estudioapp.local',
				name: 'Development User',
				roles: [],
				permissions: [],
			},
			tokens: {
				accessToken: 'dev-access-token',
				expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
			},
			createdAt: new Date().toISOString(),
		};

		req.session = session;
		req.user = session.user;

		await next();
		return;
	}

	// El cliente móvil manda el payload sellado vía `Authorization: Bearer <token>`.
	// Se comprueba primero porque es la fuente de verdad explícita del cliente.
	const authorizationHeader = req.headers.authorization;
	const bearerToken = authorizationHeader?.startsWith('Bearer ')
		? authorizationHeader.slice('Bearer '.length)
		: undefined;

	const sealedValue = bearerToken ?? req.cookies[env.SESSION_COOKIE_NAME];

	if (!sealedValue) {
		throw new AuthenticationError();
	}

	// El payload sellado sólo trae el id de sesión. El usuario, sus roles y sus permisos se
	// leen de la base en cada petición para reflejar cambios de inmediato.
	const { sessionId } = await decrypt(sealedValue);
	const session = await sessionService.resolve(sessionId);

	req.session = session;
	req.user = session.user;

	await next();
};