import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
    (process.env as any).NODE_ENV = 'test';
    process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/estudioapp?schema=public';
    process.env.APP_BASE_URL = 'http://localhost:3000';
    process.env.OAUTH_PROVIDER_NAME = 'example-oauth';
    process.env.OAUTH_AUTHORIZATION_URL = 'https://provider.example.com/oauth2/authorize';
    process.env.OAUTH_TOKEN_URL = 'https://provider.example.com/oauth2/token';
    process.env.OAUTH_ISSUER = 'https://provider.example.com/realms/estudioapp';
    process.env.OAUTH_CLIENT_ID = 'client-id';
    process.env.OAUTH_CLIENT_SECRET = 'client-secret';
    process.env.OAUTH_REDIRECT_URI = 'http://localhost:3000/api/auth/callback';
    process.env.OAUTH_MOBILE_CLIENT_ID = 'estudioapp-mobile';
    process.env.OAUTH_ADMIN_CLIENT_ID = 'estudioapp-registration-service';
    process.env.OAUTH_ADMIN_CLIENT_SECRET = 'admin-secret';
    process.env.SESSION_SECRET = '0123456789abcdef0123456789abcdef';
});

const findUniqueUser = vi.fn();
const findFirstRole = vi.fn();

vi.mock('@/database/client', () => ({
    prisma: {
        user: { findUnique: (...args: unknown[]) => findUniqueUser(...args) },
        role: { findFirst: (...args: unknown[]) => findFirstRole(...args) },
    },
}));

const createKeycloakUserMock = vi.fn();
const deleteKeycloakUserMock = vi.fn();

vi.mock('@/lib/oauth/admin', async () => {
    const actual = await vi.importActual<typeof import('@/lib/oauth/admin')>('@/lib/oauth/admin');
    return {
        ...actual,
        createKeycloakUser: (...args: unknown[]) => createKeycloakUserMock(...args),
        deleteKeycloakUser: (...args: unknown[]) => deleteKeycloakUserMock(...args),
    };
});

const createFromRegistrationMock = vi.fn();

vi.mock('@/database/users', () => ({
    createFromRegistration: (...args: unknown[]) => createFromRegistrationMock(...args),
}));

const createUserWithAccessRequestMock = vi.fn();

vi.mock('@/database/courses', () => ({
    accessRequestDb: {
        createUserWithAccessRequest: (...args: unknown[]) => createUserWithAccessRequestMock(...args),
    },
}));

vi.mock('@/lib/logger', () => ({
    logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
}));

import { KeycloakUserConflictError } from '@/lib/oauth/admin';
import { register } from './register.service';

const BASE_BODY = {
    email: 'nuevo@example.com',
    password: 'contraseñaSegura123',
    firstName: 'Nuevo',
    lastName: 'Usuario',
};

describe('register (servicio de registro público - EstudioApp)', () => {
    beforeEach(() => {
        findUniqueUser.mockReset();
        findFirstRole.mockReset();
        createKeycloakUserMock.mockReset();
        deleteKeycloakUserMock.mockReset();
        createFromRegistrationMock.mockReset();
        createUserWithAccessRequestMock.mockReset();

        findUniqueUser.mockResolvedValue(null);
    });

    it('rechaza con 409 si el email ya existe en EstudioApp, sin llamar a Keycloak', async () => {
        findUniqueUser.mockResolvedValue({ id: 'existing-user' });

        await expect(register({ ...BASE_BODY, accountType: 'estudiante' })).rejects.toMatchObject({
            statusCode: 409,
        });

        expect(createKeycloakUserMock).not.toHaveBeenCalled();
    });

    it('estudiante: crea el usuario con el rol Estudiante de inmediato', async () => {
        createKeycloakUserMock.mockResolvedValue({ keycloakId: 'kc-1' });
        findFirstRole.mockResolvedValue({ id: 'role-estudiante' });
        createFromRegistrationMock.mockResolvedValue({
            id: 'user-1',
            email: BASE_BODY.email,
            profile: { firstName: BASE_BODY.firstName, lastName: BASE_BODY.lastName },
        });

        const result = await register({ ...BASE_BODY, accountType: 'estudiante' });

        expect(result.accountType).toBe('estudiante');
        expect(createFromRegistrationMock).toHaveBeenCalledWith(
            'kc-1',
            { email: BASE_BODY.email, firstName: BASE_BODY.firstName, lastName: BASE_BODY.lastName },
            'role-estudiante',
        );
        expect(createUserWithAccessRequestMock).not.toHaveBeenCalled();
    });

    it('gestor-academico: crea el usuario y la solicitud de acceso en una sola operación, sin ningún rol', async () => {
        createKeycloakUserMock.mockResolvedValue({ keycloakId: 'kc-2' });
        createUserWithAccessRequestMock.mockResolvedValue({
            user: { id: 'user-2', email: BASE_BODY.email },
            accessRequest: { id: 'access-request-1' },
        });

        const result = await register({
            ...BASE_BODY,
            accountType: 'gestor-academico',
            organization: { name: 'Universidad Estatal Amazónica' },
            venue: { name: 'Campus Central' },
        });

        expect(result.accountType).toBe('gestor-academico');
        if (result.accountType === 'gestor-academico') {
            expect(result.organizationStatus).toBe('PENDING_APPROVAL');
            expect(result.accessRequestId).toBe('access-request-1');
        }

        expect(createUserWithAccessRequestMock).toHaveBeenCalledWith(
            'kc-2',
            { email: BASE_BODY.email, firstName: BASE_BODY.firstName, lastName: BASE_BODY.lastName },
            { name: 'Universidad Estatal Amazónica' },
            { name: 'Campus Central' },
        );
        expect(createFromRegistrationMock).not.toHaveBeenCalled();
    });

    it('traduce un conflicto de Keycloak a 409 sin crear nada en EstudioApp', async () => {
        createKeycloakUserMock.mockRejectedValue(new KeycloakUserConflictError('ya existe'));

        await expect(register({ ...BASE_BODY, accountType: 'estudiante' })).rejects.toMatchObject({
            statusCode: 409,
        });

        expect(createFromRegistrationMock).not.toHaveBeenCalled();
    });

    it('revierte (elimina) el usuario de Keycloak si el paso de EstudioApp falla', async () => {
        createKeycloakUserMock.mockResolvedValue({ keycloakId: 'kc-3' });
        findFirstRole.mockResolvedValue({ id: 'role-estudiante' });
        createFromRegistrationMock.mockRejectedValue(new Error('fallo de base de datos'));
        deleteKeycloakUserMock.mockResolvedValue(undefined);

        await expect(register({ ...BASE_BODY, accountType: 'estudiante' })).rejects.toThrow(
            'fallo de base de datos',
        );

        expect(deleteKeycloakUserMock).toHaveBeenCalledWith('kc-3');
    });

    it('revierte Keycloak si createUserWithAccessRequest falla (gestor-academico)', async () => {
        createKeycloakUserMock.mockResolvedValue({ keycloakId: 'kc-4' });
        createUserWithAccessRequestMock.mockRejectedValue(new Error('fallo de base de datos'));
        deleteKeycloakUserMock.mockResolvedValue(undefined);

        await expect(
            register({
                ...BASE_BODY,
                accountType: 'gestor-academico',
                organization: { name: 'Universidad Estatal Amazónica' },
                venue: { name: 'Campus Central' },
            }),
        ).rejects.toThrow('fallo de base de datos');

        expect(deleteKeycloakUserMock).toHaveBeenCalledWith('kc-4');
    });
});