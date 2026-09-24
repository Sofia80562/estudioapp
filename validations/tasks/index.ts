import { z } from 'zod';

export const taskParamsSchema = z.object({
    taskId: z.string().uuid(),
});

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const taskQueryParamsSchema = paginationSchema.extend({
    status: z.string().optional(),
    search: z.string().optional(),
});

export const createTaskSchema = z.object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(1000).optional(),
    dueDate: z.string().datetime().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
    expectedUpdatedAt: z.string().datetime(),
    status: z.string().optional(),
});

export type TaskQueryParams = z.infer<typeof taskQueryParamsSchema>;
export type CreateTaskBody = z.infer<typeof createTaskSchema>;
export type UpdateTaskBody = z.infer<typeof updateTaskSchema>;