import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextHandler } from 'next-connect';
import { RateLimiterMemory } from 'rate-limiter-flexible';

import { TooManyRequestsError } from '@/errors';

// Controladores en memoria para límites de tasa.
const ipLimiter = new RateLimiterMemory({ points: 5, duration: 60 * 60 });
const emailLimiter = new RateLimiterMemory({ points: 3, duration: 60 * 60 * 24 });
const aiLimiter = new RateLimiterMemory({ points: 10, duration: 60 });

const getClientIp = (req: NextApiRequest): string => {
	const forwarded = req.headers['x-forwarded-for'];

	if (typeof forwarded === 'string' && forwarded.length > 0) {
		return forwarded.split(',')[0].trim();
	}

	return req.socket.remoteAddress ?? 'unknown';
};

/** Límite de tasa por IP y por email para POST /api/auth/register o registro de usuarios. */
export const registerRateLimit = async (
	req: NextApiRequest,
	_res: NextApiResponse,
	next: NextHandler,
): Promise<void> => {
	const ip = getClientIp(req);
	const email =
		typeof req.body === 'object' && req.body !== null && typeof req.body.email === 'string'
			? req.body.email.toLowerCase()
			: undefined;

	try {
		await ipLimiter.consume(ip);

		if (email) {
			await emailLimiter.consume(email);
		}
	} catch {
		throw new TooManyRequestsError();
	}

	await next();
};

/** Límite de tasa específico para endpoints que consumen inteligencia artificial o procesamiento pesado. */
export const aiRateLimit = async (
	req: NextApiRequest,
	_res: NextApiResponse,
	next: NextHandler,
): Promise<void> => {
	try {
		// Asume que req.user puede venir inyectado por el middleware de autenticación
		const userId = (req as NextApiRequest & { user?: { id?: string } }).user?.id ?? 'anonymous';
		await aiLimiter.consume(`${userId}:${req.url ?? 'ai'}`);
	} catch {
		throw new TooManyRequestsError(
			'Has realizado demasiadas solicitudes al asistente. Intenta más tarde.',
		);
	}
	await next();
};