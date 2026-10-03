import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
    (process.env as any).NODE_ENV = 'test';
    process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/estudioapp?schema=public';
    process.env.APP_BASE_URL = 'http://localhost:3000';
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

const hashPasswordMock = vi.fn();

vi.mock('@/lib/auth/password', () => ({
    hashPassword: (...args: unknown[]) => hashPasswordMock(...args),
}));

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
        hashPasswordMock.mockReset();
        createFromRegistrationMock.mockReset();
        createUserWithAccessRequestMock.mockReset();

        findUniqueUser.mockResolvedValue(null);
        hashPasswordMock.mockResolvedValue('mocked-salt:mocked-hash');
    });

    it('rechaza con 409 si el email ya existe en EstudioApp', async () => {
        findUniqueUser.mockResolvedValue({ id: 'existing-user' });

        await expect(register({ ...BASE_BODY, accountType: 'estudiante' })).rejects.toMatchObject({
            statusCode: 409,
        });

        expect(hashPasswordMock).not.toHaveBeenCalled();
    });

    it('estudiante: hashea la contraseña y crea el usuario con el rol Estudiante de inmediato', async () => {
        findFirstRole.mockResolvedValue({ id: 'role-estudiante' });
        createFromRegistrationMock.mockResolvedValue({
            id: 'user-1',
            email: BASE_BODY.email,
            profile: { firstName: BASE_BODY.firstName, lastName: BASE_BODY.lastName },
        });

        const result = await register({ ...BASE_BODY, accountType: 'estudiante' });

        expect(result.accountType).toBe('estudiante');
        expect(hashPasswordMock).toHaveBeenCalledWith(BASE_BODY.password);
        expect(createFromRegistrationMock).toHaveBeenCalledWith(
            'mocked-salt:mocked-hash',
            { email: BASE_BODY.email, firstName: BASE_BODY.firstName, lastName: BASE_BODY.lastName },
            'role-estudiante',
        );
        expect(createUserWithAccessRequestMock).not.toHaveBeenCalled();
    });

    it('gestor-academico: crea el usuario y la solicitud de acceso en una sola operación atómica en la BD', async () => {
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

        expect(hashPasswordMock).toHaveBeenCalledWith(BASE_BODY.password);
        expect(createUserWithAccessRequestMock).toHaveBeenCalledWith(
            'mocked-salt:mocked-hash',
            { email: BASE_BODY.email, firstName: BASE_BODY.firstName, lastName: BASE_BODY.lastName },
            { name: 'Universidad Estatal Amazónica' },
            { name: 'Campus Central' },
        );
        expect(createFromRegistrationMock).not.toHaveBeenCalled();
    });

    it('propaga el error si falla la creación en la base de datos', async () => {
        findFirstRole.mockResolvedValue({ id: 'role-estudiante' });
        createFromRegistrationMock.mockRejectedValue(new Error('fallo de base de datos'));

        await expect(register({ ...BASE_BODY, accountType: 'estudiante' })).rejects.toThrow(
            'fallo de base de datos',
        );
    });
});