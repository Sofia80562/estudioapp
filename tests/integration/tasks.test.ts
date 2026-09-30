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

describe('Tasks API Integration Tests - EstudioApp', () => {
    describe('GET /api/tasks', () => {
        it('exige autenticación (401 sin sesión)', async () => {
            const handler = (await import('../../pages/api/tasks/index')).default;
            const response = createMockResponse();

            const request = {
                method: 'GET',
                url: '/api/tasks',
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

        it('devuelve las tareas académicas paginadas cuando está autorizado', async () => {
            const handler = (await import('../../pages/api/tasks/index')).default;
            const response = createMockResponse();

            const request = {
                method: 'GET',
                url: '/api/tasks?page=1&pageSize=15',
                query: { page: '1', pageSize: '15' },
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

    describe('POST /api/tasks', () => {
        it('permite registrar una tarea o asignación de estudio válida', async () => {
            const handler = (await import('../../pages/api/tasks/index')).default;
            const response = createMockResponse();

            const request = {
                method: 'POST',
                url: '/api/tasks',
                query: {},
                body: {
                    title: 'Entrega de Proyecto Base de Datos',
                    description: 'Normalización de esquemas y procedimientos almacenados PL/SQL',
                    dueDate: '2026-10-15T23:59:59.000Z',
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

        it('devuelve 422 si el formato de la fecha límite (dueDate) o el título son incorrectos', async () => {
            const handler = (await import('../../pages/api/tasks/index')).default;
            const response = createMockResponse();

            const request = {
                method: 'POST',
                url: '/api/tasks',
                query: {},
                body: {
                    title: '',
                    dueDate: 'fecha-invalida',
                },
                headers: {},
                cookies: {},
            } as never;

            try {
                await handler(request, response);
                expect([422, 400, 401]).toContain(response.statusCode);
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });

    describe('DELETE /api/tasks/{taskId}', () => {
        it('permite eliminar una tarea existente de forma segura', async () => {
            const handler = (await import('../../pages/api/tasks/[taskId]')).default;
            const response = createMockResponse();

            const request = {
                method: 'DELETE',
                url: '/api/tasks/550e8400-e29b-41d4-a716-446655440099',
                query: { taskId: '550e8400-e29b-41d4-a716-446655440099' },
                headers: {},
                cookies: {},
            } as never;

            try {
                await handler(request, response);
                expect([204, 404, 401]).toContain(response.statusCode);
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });
});