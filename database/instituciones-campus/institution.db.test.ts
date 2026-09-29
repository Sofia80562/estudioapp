import { describe, expect, it, vi } from 'vitest';
import * as institutionDb from './institution.db';
import { prisma } from '@/database/client';

vi.mock('@/database/client', () => ({
	prisma: {
		institution: {
			findMany: vi.fn(),
			findFirst: vi.fn(),
			count: vi.fn(),
			create: vi.fn(),
		},
	},
}));

describe('institutionDb operations', () => {
	it('debería listar las instituciones aplicando filtros de paginación y estado', async () => {
		const mockInstitutions = [
			{ id: 'inst-1', name: 'Universidad Estatal Amazónica', code: 'UEA', status: 'ACTIVE', campusesCount: 2 },
		];
		
		vi.mocked(prisma.institution.findMany).mockResolvedValue(mockInstitutions as any);
		vi.mocked(prisma.institution.count).mockResolvedValue(1);

		const result = await institutionDb.getAll(
			{ page: 1, pageSize: 10 },
			{ userId: 'user-1', isAdministrator: true }
		);

		expect(prisma.institution.findMany).toHaveBeenCalled();
		expect(result.institutions).toHaveLength(1);
		expect(result.institutions[0].name).toBe('Universidad Estatal Amazónica');
	});
});