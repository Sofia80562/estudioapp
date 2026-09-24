import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
	actorHasCourseScope: vi.fn(),
	getUnique: vi.fn(),
	getAll: vi.fn(),
	findCourse: vi.fn(),
	createCourse: vi.fn(),
	updateCourse: vi.fn(),
	removeWithCascade: vi.fn(),
	writeAudit: vi.fn(),
	getDetail: vi.fn(),
	isCourseUniqueConstraintError: vi.fn(() => false),
}));

vi.mock('@/database/courses', () => ({
	courseDb: {
		getAll: mocks.getAll,
		actorHasCourseScope: mocks.actorHasCourseScope,
		getUnique: mocks.getUnique,
		isCourseUniqueConstraintError: mocks.isCourseUniqueConstraintError,
		withTransaction: (operation: (repository: unknown) => Promise<unknown>) =>
			operation({
				findCourse: mocks.findCourse,
				createCourse: mocks.createCourse,
				updateCourse: mocks.updateCourse,
				removeWithCascade: mocks.removeWithCascade,
				writeAudit: mocks.writeAudit,
				getDetail: mocks.getDetail,
			}),
	},
}));

vi.mock('@/services/users/role-guard', () => ({
	isAdministrator: (user: { roles: Array<{ code: string }> }) =>
		user.roles.some(role => role.code === 'administrador'),
}));

import type { SessionUser } from '@/lib/session';

import { create, ensureCourseScope, getById, remove, update } from './course.service';

const COURSE_ID = '123e4567-e89b-42d3-a456-426614174001';
const UPDATED_AT = '2026-08-29T10:00:00.000Z';

const buildUser = ({ administrator = false } = {}): SessionUser => ({
	id: '123e4567-e89b-42d3-a456-426614174004',
	email: 'actor@example.com',
	name: 'Actor',
	roles: administrator
		? [{ id: 'role-admin', code: 'administrador', name: 'Administrador' }]
		: [{ id: 'role-student', code: 'estudiante', name: 'Estudiante' }],
	permissions: [],
});

describe('courseService — alcance por curso (feature 019)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.findCourse.mockResolvedValue({
			id: COURSE_ID,
			updatedAt: new Date(UPDATED_AT),
		});
		mocks.updateCourse.mockResolvedValue({ count: 1 });
		mocks.getDetail.mockResolvedValue({ id: COURSE_ID });
		mocks.createCourse.mockResolvedValue({ id: COURSE_ID, name: 'Matemáticas I' });
	});

	it('un administrador global no necesita alcance explícito', async () => {
		mocks.actorHasCourseScope.mockResolvedValue(false);

		await expect(
			ensureCourseScope(buildUser({ administrator: true }), COURSE_ID),
		).resolves.toBeUndefined();
		expect(mocks.actorHasCourseScope).not.toHaveBeenCalled();
	});

	it('un actor no administrador sin alcance recibe 404 opaco, no 403, cuando opaque=true', async () => {
		mocks.actorHasCourseScope.mockResolvedValue(false);

		await expect(getById(COURSE_ID, buildUser())).rejects.toMatchObject({
			statusCode: 404,
			code: 'NOT_FOUND',
		});
		expect(mocks.getUnique).not.toHaveBeenCalled();
	});

	it('un actor con alcance real puede leer el curso', async () => {
		mocks.actorHasCourseScope.mockResolvedValue(true);
		mocks.getUnique.mockResolvedValue({ id: COURSE_ID });

		await expect(getById(COURSE_ID, buildUser())).resolves.toEqual({ id: COURSE_ID });
	});

	it('update responde 409 y no escribe auditoría si expectedUpdatedAt está obsoleto', async () => {
		mocks.actorHasCourseScope.mockResolvedValue(true);
		mocks.updateCourse.mockResolvedValue({ count: 0 });

		await expect(
			update(
				COURSE_ID,
				{ name: 'Nuevo nombre', expectedUpdatedAt: UPDATED_AT },
				buildUser({ administrator: true }),
			),
		).rejects.toMatchObject({ statusCode: 409, code: 'CONFLICT' });
		expect(mocks.writeAudit).not.toHaveBeenCalled();
	});

	it('update escribe auditoría COURSE_UPDATED dentro de la transacción al tener éxito', async () => {
		mocks.actorHasCourseScope.mockResolvedValue(true);

		await update(
			COURSE_ID,
			{ name: 'Nuevo nombre', expectedUpdatedAt: UPDATED_AT },
			buildUser({ administrator: true }),
		);

		expect(mocks.writeAudit).toHaveBeenCalledWith(
			expect.objectContaining({
				courseId: COURSE_ID,
				entityId: COURSE_ID,
				action: 'COURSE_UPDATED',
			}),
		);
	});

	it('create escribe auditoría COURSE_CREATED con normalizedName derivado del nombre', async () => {
		await create({ name: '  Matemáticas   I ' }, buildUser({ administrator: true }));

		expect(mocks.createCourse).toHaveBeenCalledWith(
			expect.objectContaining({ name: 'Matemáticas I', normalizedName: 'matemáticas i' }),
		);
		expect(mocks.writeAudit).toHaveBeenCalledWith(
			expect.objectContaining({ action: 'COURSE_CREATED' }),
		);
	});

	it('create mapea el nombre duplicado a un 409 sin exponer el error de Prisma', async () => {
		mocks.isCourseUniqueConstraintError.mockReturnValue(true);
		mocks.createCourse.mockRejectedValue(new Error('P2002'));

		await expect(
			create({ name: 'Matemáticas I' }, buildUser({ administrator: true })),
		).rejects.toMatchObject({ statusCode: 409, code: 'CONFLICT' });
	});

	it('remove exige alcance y no elimina un curso fuera de él', async () => {
		mocks.actorHasCourseScope.mockResolvedValue(false);

		await expect(remove(COURSE_ID, buildUser())).rejects.toMatchObject({ statusCode: 404 });
		expect(mocks.removeWithCascade).not.toHaveBeenCalled();
	});
});

describe('courseService — cambio de estado exclusivo de Administrador (feature 023)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.findCourse.mockResolvedValue({
			id: COURSE_ID,
			updatedAt: new Date(UPDATED_AT),
		});
		mocks.updateCourse.mockResolvedValue({ count: 1 });
		mocks.getDetail.mockResolvedValue({ id: COURSE_ID });
	});

	it('un Administrador puede cambiar el status', async () => {
		mocks.actorHasCourseScope.mockResolvedValue(false);

		await update(
			COURSE_ID,
			{ status: 'INACTIVE', expectedUpdatedAt: UPDATED_AT },
			buildUser({ administrator: true }),
		);

		expect(mocks.updateCourse).toHaveBeenCalledWith(
			COURSE_ID,
			expect.any(Date),
			expect.objectContaining({ status: 'INACTIVE' }),
		);
		expect(mocks.writeAudit).toHaveBeenCalledWith(
			expect.objectContaining({
				action: 'COURSE_UPDATED',
				changes: expect.objectContaining({ status: 'INACTIVE' }),
			}),
		);
	});

	it('un actor no administrador con alcance real recibe 403 al enviar status, sin tocar la base', async () => {
		mocks.actorHasCourseScope.mockResolvedValue(true);

		await expect(
			update(
				COURSE_ID,
				{ status: 'INACTIVE', expectedUpdatedAt: UPDATED_AT },
				buildUser({ administrator: false }),
			),
		).rejects.toMatchObject({ statusCode: 403 });
		expect(mocks.updateCourse).not.toHaveBeenCalled();
		expect(mocks.writeAudit).not.toHaveBeenCalled();
	});

	it('un actor no administrador puede seguir editando otros campos sin enviar status', async () => {
		mocks.actorHasCourseScope.mockResolvedValue(true);

		await expect(
			update(
				COURSE_ID,
				{ name: 'Nuevo nombre', expectedUpdatedAt: UPDATED_AT },
				buildUser({ administrator: false }),
			),
		).resolves.toEqual({ id: COURSE_ID });
	});

	it('un status con expectedUpdatedAt obsoleto responde 409 sin auditar', async () => {
		mocks.actorHasCourseScope.mockResolvedValue(false);
		mocks.updateCourse.mockResolvedValue({ count: 0 });

		await expect(
			update(
				COURSE_ID,
				{ status: 'INACTIVE', expectedUpdatedAt: UPDATED_AT },
				buildUser({ administrator: true }),
			),
		).rejects.toMatchObject({ statusCode: 409 });
		expect(mocks.writeAudit).not.toHaveBeenCalled();
	});
});