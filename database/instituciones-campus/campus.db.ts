import { prisma } from '@/database/client';
import { NotFoundError } from '@/errors/not-found-error';
import { normalizePagination } from '@/helper/pagination';

export const isCampusUniqueConstraintError = (error: unknown): boolean => {
	if (typeof error === 'object' && error !== null && 'code' in error) {
		return (error as { code: string }).code === 'P2002';
	}
	return false;
};

type TransactionClient = any;

const createTransactionRepository = (transaction: TransactionClient) => ({
	findCampus: (campusId: string) =>
		transaction.campus.findFirst({
			where: { id: campusId, deletedAt: null },
		}),

	createCampus: (data: {
		name: string;
		code: string;
		address?: string | null;
		institutionId: string;
	}) =>
		transaction.campus.create({
			data: { ...data, status: 'ACTIVE' },
		}),

	updateCampus: (
		campusId: string,
		expectedUpdatedAt: Date,
		data: any,
	) =>
		transaction.campus.updateMany({
			where: { id: campusId, updatedAt: expectedUpdatedAt, deletedAt: null },
			data,
		}),

	remove: (campusId: string) =>
		transaction.campus.update({
			where: { id: campusId },
			data: { deletedAt: new Date(), status: 'INACTIVE' },
		}),
});

export type CampusTransactionRepository = ReturnType<typeof createTransactionRepository>;

export const getAllByInstitution = async (
	institutionId: string,
	filters: { search?: string; status?: string; page?: number; pageSize?: number }
) => {
	const { skip, take, meta } = normalizePagination(filters);

	const where: any = {
		institutionId,
		deletedAt: null,
		...(filters.status ? { status: filters.status } : {}),
	};

	if (filters.search) {
		where.OR = [
			{ name: { contains: filters.search, mode: 'insensitive' } },
			{ code: { contains: filters.search, mode: 'insensitive' } },
		];
	}

	const [campuses, total] = await Promise.all([
		prisma.campus.findMany({
			where,
			include: { institution: true },
			skip,
			take,
			orderBy: { createdAt: 'desc' },
		}),
		prisma.campus.count({ where }),
	]);

	return { campuses, meta: meta(total) };
};

export const getUnique = async (campusId: string) => {
	const record = await prisma.campus.findFirst({
		where: { id: campusId, deletedAt: null },
		include: { institution: true },
	});

	if (!record) {
		throw new NotFoundError('El campus solicitado no existe.');
	}

	return record;
};

export const withTransaction = <T>(
	operation: (repository: CampusTransactionRepository) => Promise<T>,
) => prisma.$transaction(transaction => operation(createTransactionRepository(transaction)));