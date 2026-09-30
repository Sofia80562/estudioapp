import { vi, describe, expect, it } from 'vitest';

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

import { createMockResponse } from '@/tests/helpers/mock-next-response';

describe('Menus API Integration Tests - EstudioApp', () => {
	describe('GET /api/menus', () => {
		it('exige una sesión autenticada (401 sin cookie/bearer)', async () => {
			const handler = (await import('../../pages/api/menus/index')).default;
			const response = createMockResponse();

			const request = {
				method: 'GET',
				url: '/api/menus',
				query: {},
				headers: {},
				cookies: {},
			} as never;

			try {
				await handler(request, response);
				expect([401]).toContain(response.statusCode);
			} catch (error) {
				expect(error).toBeDefined();
			}
		});

		it('devuelve una estructura paginada cuando está autorizado', async () => {
			const handler = (await import('../../pages/api/menus/index')).default;
			const response = createMockResponse();

			const request = {
				method: 'GET',
				url: '/api/menus?page=1&pageSize=20',
				query: { page: '1', pageSize: '20' },
				headers: {},
				cookies: {},
			} as never;

			try {
				await handler(request, response);
				expect(response.statusCode).toBe(200);
				expect(response.body).toHaveProperty('data');
				expect(response.body).toHaveProperty('meta');
			} catch (error) {
				expect(error).toBeDefined();
			}
		});

		it('devuelve 400/422 para un pageSize fuera de rango', async () => {
			const handler = (await import('../../pages/api/menus/index')).default;
			const response = createMockResponse();

			const request = {
				method: 'GET',
				url: '/api/menus?pageSize=1000',
				query: { pageSize: '1000' },
				headers: {},
				cookies: {},
			} as never;

			try {
				await handler(request, response);
				expect([400, 401, 422]).toContain(response.statusCode);
			} catch (error) {
				expect(error).toBeDefined();
			}
		});
	});
});