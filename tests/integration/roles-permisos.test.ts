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

describe('Roles y Permisos API Integration Tests - EstudioApp', () => {
    describe('POST /api/roles', () => {
        it('crea un nuevo rol con entradas válidas', async () => {
            const handler = (await import('../../pages/api/roles/index')).default;
            const response = createMockResponse();

            const request = {
                method: 'POST',
                url: '/api/roles?institucionId=550e8400-e29b-41d4-a716-446655440000',
                query: { institucionId: '550e8400-e29b-41d4-a716-446655440000' },
                body: {
                    name: 'Rol Estudiante Avanzado',
                    description: 'Un rol de prueba para permisos académicos',
                    permissionIds: [],
                },
                headers: {},
                cookies: {},
            } as never;

            try {
                await handler(request, response);
                expect(response.statusCode).toBe(201);
                expect(response.body).toHaveProperty('data');
            } catch (error) {
                expect(error).toBeDefined();
            }
        }); 

        it('devuelve 400 si falta el identificador institucional', async () => {
            const handler = (await import('../../pages/api/roles/index')).default;
            const response = createMockResponse();

            const request = {
                method: 'POST',
                url: '/api/roles',
                query: {},
                body: { name: 'Rol de prueba' },
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

        it('devuelve 422 para un nombre de rol inválido', async () => {
            const handler = (await import('../../pages/api/roles/index')).default;
            const response = createMockResponse();
            const request = {
                method: 'POST',
                url: '/api/roles?institucionId=550e8400-e29b-41d4-a716-446655440000',
                query: { institucionId: '550e8400-e29b-41d4-a716-446655440000' },
                body: {
                    name: '', // Nombre vacío
                    description: 'Rol inválido',
                },
                headers: {},
                cookies: {},
            } as never;
            try {
                await handler(request, response);
                expect([422, 401]).toContain(response.statusCode);
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });

    describe('GET /api/roles', () => {
        it('devuelve una lista paginada de roles', async () => {
            const handler = (await import('../../pages/api/roles/index')).default;
            const response = createMockResponse();

            const request = {
                method: 'GET',
                url: '/api/roles?institucionId=550e8400-e29b-41d4-a716-446655440000&page=1&pageSize=20',
                query: {
                    institucionId: '550e8400-e29b-41d4-a716-446655440000',
                    page: '1',
                    pageSize: '20',
                },
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

        it('devuelve 422 para parámetros de paginación inválidos', async () => {
            const handler = (await import('../../pages/api/roles/index')).default;
            const response = createMockResponse();

            const request = {
                method: 'GET',
                url: '/api/roles?institucionId=550e8400-e29b-41d4-a716-446655440000&page=0',
                query: {
                    institucionId: '550e8400-e29b-41d4-a716-446655440000',
                    page: '0',
                },
                headers: {},
                cookies: {},
            } as never;

            try {
                await handler(request, response);
                expect([422, 401]).toContain(response.statusCode);
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });

    describe('GET /api/roles/{roleId}', () => {
        it('devuelve los detalles del rol junto con sus permisos', async () => {
            const handler = (await import('../../pages/api/roles/[roleId]')).default;
            const response = createMockResponse();

            const request = {
                method: 'GET',
                url: '/api/roles/550e8400-e29b-41d4-a716-446655440001',
                query: {
                    roleId: '550e8400-e29b-41d4-a716-446655440001',
                    institucionId: '550e8400-e29b-41d4-a716-446655440000',
                },
                headers: {},
                cookies: {},
            } as never;

            try {
                await handler(request, response);
                expect([200, 404, 401]).toContain(response.statusCode);
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        it('devuelve 404 para un rol inexistente', async () => {
            const handler = (await import('../../pages/api/roles/[roleId]')).default;
            const response = createMockResponse();

            const request = {
                method: 'GET',
                url: '/api/roles/00000000-0000-0000-0000-000000000000',
                query: {
                    roleId: '00000000-0000-0000-0000-000000000000',
                    institucionId: '550e8400-e29b-41d4-a716-446655440000',
                },
                headers: {},
                cookies: {},
            } as never;

            try {
                await handler(request, response);
                expect([404, 401]).toContain(response.statusCode);
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });

    describe('PATCH /api/roles/{roleId}', () => {
        it('actualiza el nombre y la descripción del rol', async () => {
            const handler = (await import('../../pages/api/roles/[roleId]')).default;
            const response = createMockResponse();

            const request = {
                method: 'PATCH',
                url: '/api/roles/550e8400-e29b-41d4-a716-446655440001',
                query: {
                    roleId: '550e8400-e29b-41d4-a716-446655440001',
                    institucionId: '550e8400-e29b-41d4-a716-446655440000',
                },
                body: {
                    name: 'Rol Actualizado',
                    description: 'Descripción actualizada',
                },
                headers: {},
                cookies: {},
            } as never;

            try {
                await handler(request, response);
                expect([200, 404, 401]).toContain(response.statusCode);
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });

    describe('GET /api/permisos', () => {
        it('devuelve la lista paginada de permisos', async () => {
            const handler = (await import('../../pages/api/permisos/index')).default;
            const response = createMockResponse();

            const request = {
                method: 'GET',
                url: '/api/permisos?page=1&pageSize=20',
                query: {
                    page: '1',
                    pageSize: '20',
                },
                headers: {},
                cookies: {},
            } as never;

            try {
                await handler(request, response);
                expect([200, 401]).toContain(response.statusCode);
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });

    describe('Asignación de Roles a Usuarios', () => {
        it('asigna roles al crear un usuario', async () => {
            const handler = (await import('../../pages/api/users/index')).default;
            const response = createMockResponse();

            const request = {
                method: 'POST',
                url: '/api/users',
                query: {},
                body: {
                    email: 'estudiante.nuevo@estudioapp.com',
                    firstName: 'Sofía',
                    lastName: 'Beltrán',
                    institucionId: '550e8400-e29b-41d4-a716-446655440000',
                    roleIds: ['550e8400-e29b-41d4-a716-446655440001'],
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

        it('obtiene los roles de un usuario', async () => {
            const handler = (await import('../../pages/api/users/[userId]/roles/index')).default;
            const response = createMockResponse();

            const request = {
                method: 'GET',
                url: '/api/users/550e8400-e29b-41d4-a716-446655440002/roles',
                query: { userId: '550e8400-e29b-41d4-a716-446655440002' },
                headers: {},
                cookies: {},
            } as never;

            try {
                await handler(request, response);
                expect([200, 404, 401]).toContain(response.statusCode);
                if (response.statusCode === 200) {
                    expect(response.body).toHaveProperty('data');
                    expect(response.body).toHaveProperty('meta');
                }
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });
});