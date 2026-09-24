import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
	ensureCourseScope: vi.fn(),
	getAll: vi.fn(),
	getUnique: vi.fn(),
	findCourse: vi.fn(),
	findSection: vi.fn(),
	createSection: vi.fn(),
	updateSection: vi.fn(),
	removeSection: vi.fn(),
	writeAudit: vi.fn(),
	getDetail: vi.fn(),
	isSectionUniqueConstraintError: vi.fn(() => false),
}));

vi.mock('@/database/courses', () => ({
	sectionDb: {
		getAll: mocks.getAll,
		getUnique: mocks.getUnique,
		isSectionUniqueConstraintError: mocks.isSectionUniqueConstraintError,
		withTransaction: (operation: (repository: unknown) => Promise<unknown>) =>
			operation({
				findCourse: mocks.findCourse,
				findSection: mocks.findSection,
				createSection: mocks.createSection,
				updateSection: mocks.updateSection,
				removeSection: mocks.removeSection,
				writeAudit: mocks.writeAudit,
				getDetail: mocks.getDetail,
			}),
	},
}));

vi.mock('./course.service', () => ({
	ensureCourseScope: mocks.ensureCourseScope,
}));

vi.mock('@/services/users/role-guard', () => ({
	isAdministrator: (user: { roles: Array<{ code: string }> }) =>
		user.roles.some(role => role.code === 'administrador'),
}));

import type { SessionUser } from '@/lib/session';

import { create, getById, remove, update } from './section.service';

const COURSE_ID = '123e4567-e89b-42d3-a456-426614174001';
const OTHER_COURSE_ID = '123e4567-e89b-42d3-a456-426614174099';
const SECTION_ID = '123e4567-e89b-42d3-a456-426614174002';
const UPDATED_AT = '2026-08-29T10:00:00.000Z';

const actor: SessionUser = {
	id: '123e4567-e89b-42d3-a456-426614174004',
	email: 'actor@example.com',
	name: 'Actor',
	roles: [{ id: 'role-admin', code: 'administrador', name: 'Administrador' }],
	permissions: [],
};

const buildStudentActor = (): SessionUser => ({
	id: '123e4567-e89b-42d3-a456-426614174005',
	email: 'student@example.com',
	name: 'Estudiante',
	roles: [{ id: 'role-student', code: 'estudiante', name: 'Estudiante' }],
	permissions: [],
});

describe('sectionService — validación de alcance y aislamiento (EstudioApp)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.ensureCourseScope.mockResolvedValue(undefined);
		mocks.findCourse.mockResolvedValue({ id: COURSE_ID });
		mocks.findSection.mockResolvedValue({
			id: SECTION_ID,
			courseId: COURSE_ID,
			updatedAt: new Date(UPDATED_AT),
		});
		mocks.updateSection.mockResolvedValue({ count: 1 });
		mocks.getDetail.mockResolvedValue({ id: SECTION_ID });
		mocks.createSection.mockResolvedValue({ id: SECTION_ID, name: 'Sección A' });
	});

	it('getById valida el alcance de courseId antes de consultar la sección', async () => {
		mocks.getUnique.mockResolvedValue({ id: SECTION_ID, courseId: COURSE_ID });

		await getById(SECTION_ID, COURSE_ID, actor);

		expect(mocks.ensureCourseScope).toHaveBeenCalledWith(actor, COURSE_ID, true);
		expect(mocks.getUnique).toHaveBeenCalledWith(SECTION_ID, COURSE_ID);
	});

	it('create verifica que el curso exista antes de crear la sección (404, no 500)', async () => {
		mocks.findCourse.mockResolvedValue(null);

		await expect(
			create(OTHER_COURSE_ID, { name: 'Sección A' }, actor),
		).rejects.toMatchObject({ statusCode: 404, code: 'NOT_FOUND' });
		expect(mocks.createSection).not.toHaveBeenCalled();
	});

	it('create no acepta courseId del payload: siempre usa el de la ruta', async () => {
		await create(COURSE_ID, { name: 'Sección A' }, actor);

		expect(mocks.createSection).toHaveBeenCalledWith(
			COURSE_ID,
			expect.not.objectContaining({ courseId: expect.anything() }),
		);
	});

	it('update busca la sección scoped por courseId: una sección de otro curso no se encuentra', async () => {
		mocks.findSection.mockResolvedValue(null);

		await expect(
			update(
				SECTION_ID,
				OTHER_COURSE_ID,
				{ name: 'Nuevo nombre', expectedUpdatedAt: UPDATED_AT },
				actor,
			),
		).rejects.toMatchObject({ statusCode: 404, code: 'NOT_FOUND' });
		expect(mocks.updateSection).not.toHaveBeenCalled();
	});

	it('update responde 409 y no audita si expectedUpdatedAt está obsoleto', async () => {
		mocks.updateSection.mockResolvedValue({ count: 0 });

		await expect(
			update(
				SECTION_ID,
				COURSE_ID,
				{ name: 'Nuevo nombre', expectedUpdatedAt: UPDATED_AT },
				actor,
			),
		).rejects.toMatchObject({ statusCode: 409, code: 'CONFLICT' });
		expect(mocks.writeAudit).not.toHaveBeenCalled();
	});

	it('remove busca la sección scoped por courseId antes de borrar', async () => {
		mocks.findSection.mockResolvedValue(null);

		await expect(remove(SECTION_ID, OTHER_COURSE_ID, actor)).rejects.toMatchObject({
			statusCode: 404,
		});
		expect(mocks.removeSection).not.toHaveBeenCalled();
	});
});

describe('sectionService — cambio de estado exclusivo de Administrador', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.ensureCourseScope.mockResolvedValue(undefined);
		mocks.findSection.mockResolvedValue({
			id: SECTION_ID,
			courseId: COURSE_ID,
			updatedAt: new Date(UPDATED_AT),
		});
		mocks.updateSection.mockResolvedValue({ count: 1 });
		mocks.getDetail.mockResolvedValue({ id: SECTION_ID });
	});

	it('un Administrador puede cambiar el status de una sección', async () => {
		await update(
			SECTION_ID,
			COURSE_ID,
			{ status: 'INACTIVE', expectedUpdatedAt: UPDATED_AT },
			actor,
		);

		expect(mocks.updateSection).toHaveBeenCalledWith(
			SECTION_ID,
			COURSE_ID,
			expect.any(Date),
			expect.objectContaining({ status: 'INACTIVE' }),
		);
		expect(mocks.writeAudit).toHaveBeenCalledWith(
			expect.objectContaining({
				action: 'SECTION_UPDATED',
				changes: expect.objectContaining({ status: 'INACTIVE' }),
			}),
		);
	});

	it('un Estudiante con alcance real recibe 403 al enviar status, sin tocar la base', async () => {
		await expect(
			update(
				SECTION_ID,
				COURSE_ID,
				{ status: 'INACTIVE', expectedUpdatedAt: UPDATED_AT },
				buildStudentActor(),
			),
		).rejects.toMatchObject({ statusCode: 403 });
		expect(mocks.updateSection).not.toHaveBeenCalled();
		expect(mocks.writeAudit).not.toHaveBeenCalled();
	});

	it('un Estudiante puede seguir editando otros campos sin enviar status', async () => {
		await expect(
			update(
				SECTION_ID,
				COURSE_ID,
				{ name: 'Nuevo nombre', expectedUpdatedAt: UPDATED_AT },
				buildStudentActor(),
			),
		).resolves.toEqual({ id: SECTION_ID });
	});
});