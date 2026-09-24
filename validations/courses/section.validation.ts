import { z } from 'zod';

export const sectionParamsSchema = z
    .object({
        courseId: z.string().uuid('Invalid course ID'),
        sectionId: z.string().uuid('Invalid section ID'), // Ajustado de moduleId a sectionId para coincidir con tus rutas
    })
    .strict();

export const createSectionSchema = z
    .object({
        name: z.string().min(1, 'Name is required').max(150),
        description: z.string().max(500).optional().or(z.literal('')),
        classroom: z.string().max(100).optional().or(z.literal('')),
        schedule: z.string().max(150).optional().or(z.literal('')),
        capacity: z.number().int().positive().optional(),
        expectedUpdatedAt: z.string().datetime().optional(), // o z.date() según recibas las fechas
    })
    .strict();

export const updateSectionSchema = z
    .object({
        name: z.string().min(1, 'Name is required').max(150).optional(),
        description: z.string().max(500).optional().or(z.literal('')),
        classroom: z.string().max(100).optional().or(z.literal('')),
        schedule: z.string().max(150).optional().or(z.literal('')),
        capacity: z.number().int().positive().optional(),
        expectedUpdatedAt: z.string().datetime().optional(),
        status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    })
    .strict()
    .refine(
        value =>
            value.name !== undefined ||
            value.description !== undefined ||
            value.classroom !== undefined ||
            value.schedule !== undefined ||
            value.capacity !== undefined ||
            value.expectedUpdatedAt !== undefined ||
            value.status !== undefined,
        { message: 'Debes enviar al menos un campo editable para la sección.' },
    );

export type SectionParams = z.infer<typeof sectionParamsSchema>;
export type CreateSectionBody = z.infer<typeof createSectionSchema>;
export type UpdateSectionBody = z.infer<typeof updateSectionSchema>;