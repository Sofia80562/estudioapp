import { prisma } from '@/database/client';
import { NotFoundError } from '@/errors/not-found-error';
import { normalizePagination } from '@/helper/pagination';

export const isPermissionUniqueConstraintError = (error: unknown): boolean => {
	if (typeof error === 'object' && error !== null && 'code' in error) {
		return (error as { code: string }).code === 'P2002';
	}
	return false;
};

type TransactionClient = any;

const createTransactionRepository = (transaction: TransactionClient) => ({
	findPermission: (permissionId: string) =>
		transaction.permission.findFirst({
			where: { id: permissionId },
		}),

	createPermission: (data: {
		module: string;
		action: string;
		code: string;
		description?: string | null;
	}) =>
		transaction.permission.create({
			data,
		}),

	updatePermission: (permissionId: string, data: any) =>
		transaction.permission.update({
			where: { id: permissionId },
			data,
		}),

	removePermission: (permissionId: string) =>
		transaction.permission.delete({
			where: { id: permissionId },
		}),
});

export type PermissionTransactionRepository = ReturnType<typeof createTransactionRepository>;

export const getAll = async (
	filters: { search?: string; module?: string; page?: number; pageSize?: number }
) => {
	const { skip, take, meta } = normalizePagination(filters);

	const where: any = {
		...(filters.module ? { module: filters.module } : {}),
	};

	if (filters.search) {
		where.OR = [
			{ code: { contains: filters.search, mode: 'insensitive' } },
			{ description: { contains: filters.search, mode: 'insensitive' } },
			{ module: { contains: filters.search, mode: 'insensitive' } },
		];
	}

	const [permissions, total] = await Promise.all([
		prisma.permission.findMany({
			where,
			skip,
			take,
			orderBy: { module: 'asc' },
		}),
		prisma.permission.count({ where }),
	]);

	return { permissions, meta: meta(total) };
};

export const getUnique = async (permissionId: string) => {
	const record = await prisma.permission.findFirst({
		where: { id: permissionId },
	});

	if (!record) {
		throw new NotFoundError('El permiso solicitado no existe.');
	}

	return record;
};

export const withTransaction = <T>(
	operation: (repository: PermissionTransactionRepository) => Promise<T>,
) => prisma.$transaction(transaction => operation(createTransactionRepository(transaction)));