import { z } from 'zod';

export * from './campus.validation';

export const courseParamsSchema = z
    .object({
        courseId: z.string().uuid('Invalid course ID'),
    })
    .strict();

export const updateCourseSchema = z
    .object({
        name: z.string().min(1, 'Course name is required').max(150).optional(),
        description: z.string().max(500).optional().or(z.literal('')),
        status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    })
    .strict()
    .refine(
        value =>
            value.name !== undefined ||
            value.description !== undefined ||
            value.status !== undefined,
        { message: 'Debes enviar al menos un campo editable para el curso.' },
    );

export const courseQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional(),
    pageSize: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().max(255).optional(),
    status: z.string().max(50).optional(),
});

// Tipos inferidos para cursos
export type CourseParams = z.infer<typeof courseParamsSchema>;
export type UpdateCourseBody = z.infer<typeof updateCourseSchema>;
export type CourseQueryParams = z.infer<typeof courseQuerySchema>;