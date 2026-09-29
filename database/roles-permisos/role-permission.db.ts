import { prisma } from '@/database/client';

type TransactionClient = any;

const createTransactionRepository = (transaction: TransactionClient) => ({
	assignPermissionToRole: (roleId: string, permissionId: string, granted = true) =>
		transaction.rolePermission.upsert({
			where: { roleId_permissionId: { roleId, permissionId } },
			update: { granted },
			create: { roleId, permissionId, granted },
		}),

	removePermissionFromRole: (roleId: string, permissionId: string) =>
		transaction.rolePermission.delete({
			where: { roleId_permissionId: { roleId, permissionId } },
		}),

	clearRolePermissions: (roleId: string) =>
		transaction.rolePermission.deleteMany({
			where: { roleId },
		}),
});

export type RolePermissionTransactionRepository = ReturnType<typeof createTransactionRepository>;

export const getPermissionsByRole = async (roleId: string) => {
	return prisma.rolePermission.findMany({
		where: { roleId },
		include: { permission: true },
	});
};

export const withTransaction = <T>(
	operation: (repository: RolePermissionTransactionRepository) => Promise<T>,
) => prisma.$transaction(transaction => operation(createTransactionRepository(transaction)));