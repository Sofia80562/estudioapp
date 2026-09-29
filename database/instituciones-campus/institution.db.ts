import { prisma } from '@/database/client';
import { NotFoundError } from '@/errors/not-found-error';
import { normalizePagination } from '@/helper/pagination';

export const isInstitutionUniqueConstraintError = (error: unknown): boolean => {
	if (typeof error === 'object' && error !== null && 'code' in error) {
		return (error as { code: string }).code === 'P2002';
	}
	return false;
};

type TransactionClient = any;

const createTransactionRepository = (transaction: TransactionClient) => ({
	findInstitution: (institutionId: string) =>
		transaction.institution.findFirst({
			where: { id: institutionId, deletedAt: null },
		}),

	createInstitution: (data: {
		name: string;
		code?: string;
		description?: string | null;
	}) =>
		transaction.institution.create({
			data: { ...data, status: 'ACTIVE' },
		}),

	updateInstitution: (
		institutionId: string,
		expectedUpdatedAt: Date,
		data: any,
	) =>
		transaction.institution.updateMany({
			where: { id: institutionId, updatedAt: expectedUpdatedAt, deletedAt: null },
			data,
		}),

	removeWithCascade: async (institutionId: string) => {
		await transaction.campus.updateMany({
			where: { institutionId, deletedAt: null },
			data: { deletedAt: new Date(), status: 'INACTIVE' },
		});

		return transaction.institution.update({
			where: { id: institutionId },
			data: { deletedAt: new Date(), status: 'INACTIVE' },
		});
	},
});

export type InstitutionTransactionRepository = ReturnType<typeof createTransactionRepository>;

export const getAll = async (
	filters: { search?: string; status?: string; orderBy?: string; order?: 'asc' | 'desc'; page?: number; pageSize?: number },
	actor: { userId: string; isAdministrator: boolean },
) => {
	const { skip, take, meta } = normalizePagination(filters);

	const where: any = {
		deletedAt: null,
		...(filters.status ? { status: filters.status } : {}),
	};

	if (filters.search) {
		where.OR = [
			{ name: { contains: filters.search, mode: 'insensitive' } },
			{ code: { contains: filters.search, mode: 'insensitive' } },
		];
	}

	const [institutions, total] = await Promise.all([
		prisma.institution.findMany({
			where,
			include: {
				_count: { select: { campuses: { where: { deletedAt: null } } } },
			},
			skip,
			take,
			orderBy: filters.orderBy
				? { [filters.orderBy]: filters.order ?? 'asc' }
				: { createdAt: 'desc' },
		}),
		prisma.institution.count({ where }),
	]);

	const mappedInstitutions = institutions.map((inst: any) => {
		const { _count, ...rest } = inst;
		return { ...rest, campusesCount: _count?.campuses ?? 0 };
	});

	return { institutions: mappedInstitutions, meta: meta(total) };
};

export const getUnique = async (institutionId: string) => {
	const record = await prisma.institution.findFirst({
		where: { id: institutionId, deletedAt: null },
		include: { campuses: { where: { deletedAt: null } } },
	});

	if (!record) {
		throw new NotFoundError('La institución solicitada no existe.');
	}

	return record;
};

export const withTransaction = <T>(
	operation: (repository: InstitutionTransactionRepository) => Promise<T>,
) => prisma.$transaction(transaction => operation(createTransactionRepository(transaction)));