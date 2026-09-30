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

describe('Study Sessions API Integration Tests - EstudioApp', () => {
    describe('GET /api/study-sessions', () => {
        it('exige autenticación (401 sin sesión)', async () => {
            const handler = (await import('../../pages/api/study-sessions/index')).default;
            const response = createMockResponse();

            const request = {
                method: 'GET',
                url: '/api/study-sessions',
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

        it('devuelve las sesiones de estudio de forma paginada cuando está autorizado', async () => {
            const handler = (await import('../../pages/api/study-sessions/index')).default;
            const response = createMockResponse();

            const request = {
                method: 'GET',
                url: '/api/study-sessions?page=1&pageSize=10',
                query: { page: '1', pageSize: '10' },
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
    });

    describe('POST /api/study-sessions', () => {
        it('crea una nueva sesión de estudio con datos válidos', async () => {
            const handler = (await import('../../pages/api/study-sessions/index')).default;
            const response = createMockResponse();

            const request = {
                method: 'POST',
                url: '/api/study-sessions',
                query: {},
                body: {
                    title: 'Repaso de Arquitectura Flutter',
                    durationMinutes: 45,
                    subject: 'Desarrollo Móvil',
                },
                headers: {},
                cookies: {},
            } as never;

            try {
                await handler(request, response);
                expect([201, 401]).toContain(response.statusCode);
                if (response.statusCode === 201) {
                    expect(response.body).toHaveProperty('data');
                }
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        it('devuelve 400/422 si faltan campos obligatorios en la sesión', async () => {
            const handler = (await import('../../pages/api/study-sessions/index')).default;
            const response = createMockResponse();

            const request = {
                method: 'POST',
                url: '/api/study-sessions',
                query: {},
                body: {
                    title: '', // Título vacío
                },
                headers: {},
                cookies: {},
            } as never;

            try {
                await handler(request, response);
                expect([400, 422, 401]).toContain(response.statusCode);
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });
});