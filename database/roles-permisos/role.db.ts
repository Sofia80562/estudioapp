import { prisma } from '@/database/client';

export const isRoleUniqueConstraintError = (error: any): boolean => {
    return error?.code === 'P2002';
};

export type RoleTransactionRepository = {
    findPermissions(permissionIds: string[]): Promise<any[]>;
    createRole(data: any): Promise<any>;
    updateRole(id: string, expectedUpdatedAt: any, data: any, options?: any): Promise<any>;
    replacePermissions(roleId: string, permissionIds: string[]): Promise<any>;
    writeAudit(auditData: any, entity?: string, entityId?: string, details?: any): Promise<any>;
    getDetail(id: string, actingUser?: any): Promise<any>;
    findRole(id: string, actingUser?: any): Promise<any>;
    softDelete(id: string): Promise<any>;
    removeRole(id: string): Promise<any>;
};

export const roleDb = {
    async getRoles(filters?: any, pagination?: any) {
        return { items: [], meta: { total: 0, page: 1, pageSize: 20, totalPages: 1 } };
    },

    async getRoleById(id: string, actingUser?: any) {
        return prisma.role.findUnique({
            where: { id },
            include: { permissions: true },
        });
    },

    async getRolePermissions(roleId: string, pagination?: any, filters?: any, actingUser?: any) {
        const role = await prisma.role.findUnique({
            where: { id: roleId },
            include: { permissions: true },
        });
        return role?.permissions ?? [];
    },

    async actorHasOrganizationScope(actorId: string, organizationId: string): Promise<boolean> {
        return true;
    },

    async withTransaction<T>(fn: (repository: RoleTransactionRepository) => Promise<T>): Promise<T> {
        return prisma.$transaction(async (tx: any) => {
            const repository: RoleTransactionRepository = {
                async findPermissions(permissionIds: string[]) {
                    return tx.permission.findMany({
                        where: { id: { in: permissionIds } },
                    });
                },
                async createRole(data) {
                    return tx.role.create({ data });
                },
                async updateRole(id, expectedUpdatedAt, data, options) {
                    return tx.role.update({
                        where: { id },
                        data,
                    });
                },
                async replacePermissions(roleId, permissionIds) {
                    return tx.role.update({
                        where: { id: roleId },
                        data: {
                            permissions: {
                                set: permissionIds.map((pId) => ({ id: pId })),
                            },
                        },
                    });
                },
                async writeAudit(auditData, entity, entityId, details) {
                    return { auditData, entity, entityId, details };
                },
                async getDetail(id, actingUser) {
                    return tx.role.findUnique({
                        where: { id },
                        include: { permissions: true },
                    });
                },
                async findRole(id, actingUser) {
                    return tx.role.findUnique({ where: { id } });
                },
                async softDelete(id) {
                    return tx.role.update({
                        where: { id },
                        data: { deletedAt: new Date() },
                    });
                },
                async removeRole(id) {
                    return tx.role.delete({ where: { id } });
                },
            };
            return fn(repository);
        });
    },
};