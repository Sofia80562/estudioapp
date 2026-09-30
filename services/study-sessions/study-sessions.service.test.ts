import { describe, expect, it, vi, beforeEach } from 'vitest';
import { studySessionService } from './index';
import { prisma } from '@/lib/prisma';
import { NotFoundError } from '@/errors';

vi.mock('@/lib/db', () => ({
	prisma: {
		studySession: {
			findUnique: vi.fn(),
			count: vi.fn(),
			findMany: vi.fn(),
			create: vi.fn(),
			delete: vi.fn(),
		},
	},
}));

describe('Study Sessions Service', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('lanza NotFoundError si la sesión de estudio no existe por ID', async () => {
		vi.mocked(prisma.studySession.findUnique).mockResolvedValueOnce(null);

		await expect(studySessionService.getById('non-existent-id')).rejects.toThrow(NotFoundError);
	});

	it('crea y devuelve una nueva sesión de estudio correctamente', async () => {
		const mockNewSession = {
			id: 'uuid-123',
			title: 'Repaso de Algoritmos',
			durationMinutes: 50,
			subject: 'Estructura de Datos',
			userId: 'user-uuid',
			createdAt: new Date(),
		};

		vi.mocked(prisma.studySession.create).mockResolvedValueOnce(mockNewSession as never);

		const result = await studySessionService.create(
			{ title: 'Repaso de Algoritmos', durationMinutes: 50, subject: 'Estructura de Datos' },
			'user-uuid'
		);

		expect(result).toEqual(mockNewSession);
		expect(prisma.studySession.create).toHaveBeenCalledTimes(1);
	});
});