import { prisma } from '@/lib/prisma';

export const taskDb = {
    async getAll(
        filters: { page?: number; pageSize?: number; status?: string; search?: string },
        context: { userId: string },
    ) {
        const page = filters.page || 1;
        const pageSize = filters.pageSize || 20;
        const skip = (page - 1) * pageSize;

        const where: any = {
            userId: context.userId,
        };

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.search) {
            where.title = { contains: filters.search, mode: 'insensitive' };
        }

        const [items, total] = await Promise.all([
            (prisma as any).task.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            }),
            (prisma as any).task.count({ where }),
        ]);

        return {
            items,
            meta: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    },

    async getUnique(taskId: string) {
        return (prisma as any).task.findUnique({
            where: { id: taskId },
        });
    },

    async withTransaction<T>(fn: (repository: any) => Promise<T>): Promise<T> {
        return prisma.$transaction(async (tx: any) => {
            const repository = {
                async createTask(data: any) {
                    return tx.task.create({ data });
                },
                async findTask(id: string) {
                    return tx.task.findUnique({ where: { id } });
                },
                async updateTask(id: string, expectedUpdatedAt: Date, data: any) {
                    return tx.task.updateMany({
                        where: { id, updatedAt: expectedUpdatedAt },
                        data,
                    });
                },
                async getDetail(id: string) {
                    return tx.task.findUnique({ where: { id } });
                },
                async removeWithCascade(id: string) {
                    return tx.task.delete({ where: { id } });
                },
            };
            return fn(repository);
        });
    },
};