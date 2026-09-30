import { prisma } from '@/lib/prisma';
import { NotFoundError } from '@/errors';

export const institucionService = {
	async getAll(page: number = 1, pageSize: number = 10) {
		const skip = (page - 1) * pageSize;

		const [instituciones, total] = await Promise.all([
			prisma.institution.findMany({
				skip,
				take: pageSize,
				orderBy: { name: 'asc' },
			}),
			prisma.institution.count(),
		]);

		return {
			instituciones,
			meta: {
				page,
				pageSize,
				total,
				totalPages: Math.ceil(total / pageSize),
			},
		};
	},

	async getById(institucionId: string) {
		const institucion = await prisma.institution.findUnique({
			where: { id: institucionId },
		});

		if (!institucion) {
			throw new NotFoundError('Institución no encontrada.');
		}

		return institucion;
	},

	async create(data: { name: string; siglas?: string }) {
		return await prisma.institution.create({
			data,
		});
	},

	async getCampusByInstitucionId(institucionId: string, page: number = 1, pageSize: number = 10) {
		await this.getById(institucionId);

		const skip = (page - 1) * pageSize;

		const [campus, total] = await Promise.all([
			prisma.campus.findMany({
				where: { institutionId: institucionId },
				skip,
				take: pageSize,
			}),
			prisma.campus.count({ where: { institutionId: institucionId } }),
		]);

		return {
			campus,
			meta: {
				page,
				pageSize,
				total,
				totalPages: Math.ceil(total / pageSize),
			},
		};
	},
};