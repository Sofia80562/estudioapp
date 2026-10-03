import { defaults as ironDefaults, seal, unseal } from '@hapi/iron';
import type { NextApiResponse } from 'next';

import { AuthenticationError } from '@/errors/auth';
import { env } from '@/lib/config/env';
import { appendSetCookie, buildCookieHeader, buildExpiredCookieHeader } from '@/lib/http/cookies';

export type SessionRole = {
    id: string;
    code: string;
    name: string;
};

export type SessionPermission = {
    id: string;
    code: string;
};

export type SessionUser = {
    id: string;
    email: string;
    name: string;
    roles: SessionRole[];
    permissions: SessionPermission[];
};

export type SessionTokenSet = {
    accessToken: string;
    refreshToken?: string | null;
    idToken?: string | null;
    tokenType?: string | null;
    expiresAt: string;
    nonce?: string | null;
    /**
     * Identificador opcional del cliente o tipo de dispositivo conectado.
     */
    clientId?: string;
};

/**
 * Lo ÚNICO que viaja dentro de la cookie cifrada.
 * Los datos pesados de la sesión viven en la base de datos de PostgreSQL, no aquí.
 */
export type SessionCookiePayload = {
    sessionId: string;
    createdAt: string;
};

/**
 * La sesión ya resuelta que el middleware deja en `req.session`.
 */
export type SessionPayload = {
    sessionId: string;
    user: SessionUser;
    tokens: SessionTokenSet;
    createdAt: string;
};

const getSecrets = (): string[] => [
    env.SESSION_SECRET,
    ...(env.SESSION_PREVIOUS_SECRET ? [env.SESSION_PREVIOUS_SECRET] : []),
];

const unsealWithSecrets = async (value: string, ttlSeconds: number): Promise<unknown> => {
    for (const secret of getSecrets()) {
        try {
            return await unseal(value, secret, { ...ironDefaults, ttl: ttlSeconds * 1000 });
        } catch {
            continue;
        }
    }

    throw new AuthenticationError('Tu sesión no es válida o ha expirado. Inicia sesión de nuevo.');
};

/** Sella los tokens o metadatos de sesión para guardarlos de forma segura en la base de datos. */
export const sealTokens = async (tokens: SessionTokenSet): Promise<string> =>
    seal(tokens, env.SESSION_SECRET, {
        ...ironDefaults,
        ttl: 0,
    });

export const unsealTokens = async (sealedTokens: string): Promise<SessionTokenSet> =>
    (await unsealWithSecrets(sealedTokens, 0)) as SessionTokenSet;

export const encrypt = async (payload: SessionCookiePayload): Promise<string> =>
    seal(payload, env.SESSION_SECRET, {
        ...ironDefaults,
        ttl: env.SESSION_COOKIE_MAX_AGE_SECONDS * 1000,
    });

export const decrypt = async (cookieValue: string): Promise<SessionCookiePayload> =>
    (await unsealWithSecrets(
        cookieValue,
        env.SESSION_COOKIE_MAX_AGE_SECONDS,
    )) as SessionCookiePayload;

export const setSessionCookie = async (
    response: NextApiResponse,
    payload: SessionCookiePayload,
): Promise<void> => {
    const cookieValue = await encrypt(payload);
    const cookie = buildCookieHeader(env.SESSION_COOKIE_NAME, cookieValue, {
        maxAgeSeconds: env.SESSION_COOKIE_MAX_AGE_SECONDS,
        path: env.SESSION_COOKIE_PATH,
        domain: env.SESSION_COOKIE_DOMAIN,
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
    });

    response.setHeader(
        'Set-Cookie',
        appendSetCookie(response.getHeader('Set-Cookie') as string | string[] | undefined, cookie),
    );
};

export const clearSessionCookie = (response: NextApiResponse): void => {
    response.setHeader(
        'Set-Cookie',
        appendSetCookie(
            response.getHeader('Set-Cookie') as string | string[] | undefined,
            buildExpiredCookieHeader(env.SESSION_COOKIE_NAME, {
                path: env.SESSION_COOKIE_PATH,
                domain: env.SESSION_COOKIE_DOMAIN,
            }),
        ),
    );
};