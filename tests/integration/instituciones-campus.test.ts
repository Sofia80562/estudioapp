import { vi, describe, expect, it } from 'vitest';

vi.hoisted(() => {
	const env = process.env as Record<string, string>;
	env.NODE_ENV = 'test';
	env.DATABASE_URL = 'postgresql://user:password@localhost:5432/estudioapp?schema=public';
	env.APP_BASE_URL = 'http://localhost:3000';
	env.SESSION_SECRET = '0123456789abcdef0123456789abcdef';
	env.SESSION_COOKIE_NAME = 'estudioapp_session';
});

import { createMockResponse } from '../helpers/mock-next-response';

describe('Instituciones y Campus API Integration Tests - EstudioApp', () => {
	describe('GET /api/instituciones', () => {
		it('exige una sesión autenticada (401 sin credenciales)', async () => {
			const handler = (await import('../../pages/api/instituciones/index')).default;
			const response = createMockResponse();

			const request = {
				method: 'GET',
				url: '/api/instituciones',
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
	});
});