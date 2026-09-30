import { vi, describe, expect, it, beforeEach } from 'vitest';

vi.hoisted(() => {
    const env = process.env as Record<string, any>;
    env.NODE_ENV = 'test';
    env.DATABASE_URL = 'postgresql://user:password@localhost:5432/estudioapp?schema=public';
    env.APP_BASE_URL = 'http://localhost:3000';
    env.OAUTH_PROVIDER_NAME = 'example-oauth';
    env.OAUTH_AUTHORIZATION_URL = 'https://provider.example.com/oauth2/authorize';
    env.OAUTH_TOKEN_URL = 'https://provider.example.com/oauth2/token';
    env.OAUTH_ISSUER = 'https://provider.example.com/';
    env.OAUTH_CLIENT_ID = 'client-id';
    env.OAUTH_CLIENT_SECRET = 'client-secret';
    env.OAUTH_REDIRECT_URI = 'http://localhost:3000/api/auth/callback';
    env.OAUTH_MOBILE_CLIENT_ID = 'estudioapp-mobile';
    env.OAUTH_SCOPE = 'openid email profile offline_access';
    env.OAUTH_SUCCESS_REDIRECT_URL = 'http://localhost:3000/';
    env.SESSION_SECRET = '0123456789abcdef0123456789abcdef';
    env.SESSION_COOKIE_NAME = 'estudioapp_session';
    env.SESSION_TEMP_COOKIE_NAME = 'estudioapp_oauth_state';
    env.SESSION_COOKIE_PATH = '/';
    env.SESSION_COOKIE_MAX_AGE_SECONDS = '28800';
    env.SESSION_TEMP_COOKIE_MAX_AGE_SECONDS = '600';
});

import { AuthorizationError } from '@/errors/auth';
import type { SessionUser } from '@/lib/session';

const NON_ADMIN_USER: SessionUser = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'gestor.estudio@estudioapp.com',
    name: 'Gestor Académico',
    roles: [{ id: 'role-manager', code: 'gestor-academico', name: 'Gestor Académico' }],
    permissions: [
        { id: 'perm-1', code: 'users.read' },
        { id: 'perm-2', code: 'users.manage' },
    ],
};

const TARGET_USER_ID = '550e8400-e29b-41d4-a716-446655440002';
const SYSTEM_ROLE_ID = '550e8400-e29b-41d4-a716-446655440003';

vi.mock('@/middleware/auth', () => ({
    auth: async (req: never, _res: never, next: () => Promise<void>) => {
        (req as { user: SessionUser }).user = NON_ADMIN_USER;
        await next();
    },
}));

const getById = vi.fn();
const addRolesToUser = vi.fn();

vi.mock('@/services/users', () => ({
    userService: {
        getById: (...args: unknown[]) => getById(...args),
        addRolesToUser: (...args: unknown[]) => addRolesToUser(...args),
    },
}));

import { createMockResponse } from '../helpers/mock-next-response';

describe('POST /api/users/{userId}/roles — escalation guard wiring (EstudioApp)', () => {
    beforeEach(() => {
        getById.mockReset();
        addRolesToUser.mockReset();
        getById.mockResolvedValue({ id: TARGET_USER_ID, roles: [] });
    });

    it('devuelve 403 cuando el servicio rechaza la asignación de un rol de sistema', async () => {
        addRolesToUser.mockRejectedValueOnce(
            new AuthorizationError('No tienes permiso para asignar un rol de sistema.'),
        );

        const handler = (await import('../../pages/api/users/[userId]/roles/index')).default;
        const response = createMockResponse();

        const request = {
            method: 'POST',
            url: `/api/users/${TARGET_USER_ID}/roles`,
            query: { userId: TARGET_USER_ID },
            body: { roleIds: [SYSTEM_ROLE_ID] },
            headers: {},
            cookies: {},
        } as never;

        await handler(request, response);

        expect(addRolesToUser).toHaveBeenCalledWith(TARGET_USER_ID, [SYSTEM_ROLE_ID], NON_ADMIN_USER);
        expect(response.statusCode).toBe(403);
    });

    it('delega el conjunto completo de roles al servicio en una sola llamada', async () => {
        addRolesToUser.mockResolvedValueOnce(undefined);
        getById.mockResolvedValueOnce({ id: TARGET_USER_ID, roles: [] }).mockResolvedValueOnce({
            id: TARGET_USER_ID,
            roles: [{ id: SYSTEM_ROLE_ID, code: 'gestor-academico' }],
        });

        const handler = (await import('../../pages/api/users/[userId]/roles/index')).default;
        const response = createMockResponse();

        const request = {
            method: 'POST',
            url: `/api/users/${TARGET_USER_ID}/roles`,
            query: { userId: TARGET_USER_ID },
            body: { roleIds: [SYSTEM_ROLE_ID] },
            headers: {},
            cookies: {},
        } as never;

        await handler(request, response);

        expect(addRolesToUser).toHaveBeenCalledTimes(1);
        expect(addRolesToUser).toHaveBeenCalledWith(TARGET_USER_ID, [SYSTEM_ROLE_ID], NON_ADMIN_USER);
        expect(response.statusCode).toBe(201);
    });
});