import { prisma } from '@/database/client';

export type CreateTaskInput = {
	title: string;
	description?: string;
	status?: string;
	dueDate?: Date | string;
	userId: string;
};

export type UpdateTaskInput = {
	title?: string;
	description?: string;
	status?: string;
	dueDate?: Date | string;
};

export const TaskModel = {
	async getAll(userId?: string) {
		return prisma.task.findMany({
			where: userId ? { userId } : undefined,
			orderBy: { createdAt: 'desc' },
		});
	},

	async getById(id: string) {
		return prisma.task.findUnique({
			where: { id },
		});
	},

	async create(data: CreateTaskInput) {
		return prisma.task.create({
			data: {
				title: data.title,
				description: data.description,
				status: data.status ?? 'PENDING',
				dueDate: data.dueDate ? new Date(data.dueDate) : null,
				userId: data.userId,
			},
		});
	},

	async update(id: string, data: UpdateTaskInput) {
		return prisma.task.update({
			where: { id },
			data: {
				...(data.title !== undefined && { title: data.title }),
				...(data.description !== undefined && { description: data.description }),
				...(data.status !== undefined && { status: data.status }),
				...(data.dueDate !== undefined && { dueDate: data.dueDate ? new Date(data.dueDate) : null }),
			},
		});
	},

	async delete(id: string) {
		return prisma.task.delete({
			where: { id },
		});
	},
};