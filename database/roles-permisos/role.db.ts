import { prisma } from '@/database/client';
import { NotFoundError } from '@/errors/not-found-error';
import { normalizePagination } from '@/helper/pagination';

export const isRoleUniqueConstraintError = (error: unknown): boolean => {
	if (typeof error === 'object' && error !== null && 'code' in error) {
		return (error as { code: string }).code === 'P2002';
	}
	return false;
};

type TransactionClient = any;

const createTransactionRepository = (transaction: TransactionClient) => ({
	findRole: (roleId: string) =>
		transaction.role.findFirst({
			where: { id: roleId, deletedAt: null },
		}),

	createRole: (data: {
		code: string;
		name: string;
		normalizedName: string;
		description?: string | null;
		isSystem?: boolean;
	}) =>
		transaction.role.create({
			data,
		}),

	updateRole: (roleId: string, expectedUpdatedAt: Date, data: any) =>
		transaction.role.updateMany({
			where: { id: roleId, updatedAt: expectedUpdatedAt, deletedAt: null },
			data,
		}),

	removeRole: (roleId: string) =>
		transaction.role.update({
			where: { id: roleId },
			data: { deletedAt: new Date() },
		}),
});

export type RoleTransactionRepository = ReturnType<typeof createTransactionRepository>;

export const getAll = async (
	filters: { search?: string; page?: number; pageSize?: number }
) => {
	const { skip, take, meta } = normalizePagination(filters);

	const where: any = { deletedAt: null };

	if (filters.search) {
		where.OR = [
			{ name: { contains: filters.search, mode: 'insensitive' } },
			{ code: { contains: filters.search, mode: 'insensitive' } },
		];
	}

	const [roles, total] = await Promise.all([
		prisma.role.findMany({
			where,
			include: {
				_count: { select: { permissions: true, userRoles: true } },
			},
			skip,
			take,
			orderBy: { createdAt: 'desc' },
		}),
		prisma.role.count({ where }),
	]);

	const mappedRoles = roles.map((role: any) => {
		const { _count, ...rest } = role;
		return {
			...rest,
			permissionsCount: _count?.permissions ?? 0,
			usersCount: _count?.userRoles ?? 0,
		};
	});

	return { roles: mappedRoles, meta: meta(total) };
};

export const getUnique = async (roleId: string) => {
	const record = await prisma.role.findFirst({
		where: { id: roleId, deletedAt: null },
		include: {
			permissions: {
				include: { permission: true },
			},
		},
	});

	if (!record) {
		throw new NotFoundError('El rol solicitado no existe.');
	}

	return record;
};

export const withTransaction = <T>(
	operation: (repository: RoleTransactionRepository) => Promise<T>,
) => prisma.$transaction(transaction => operation(createTransactionRepository(transaction)));