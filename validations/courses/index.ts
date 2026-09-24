export * from './institucion.validation';
export * from './campus.validation';
export * from './section.validation';

import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(150),
  code: z.string().min(1, 'El código es obligatorio').max(50),
  description: z.string().max(500).optional().or(z.literal('')),
  credits: z.number().int().positive().optional(),
  semester: z.number().int().positive().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  institutionId: z.string().uuid().optional(),
});

export const updateCourseSchema = createCourseSchema.partial().extend({
  expectedUpdatedAt: z.string().datetime().optional(),
});

export type CreateCourseBody = z.infer<typeof createCourseSchema>;
export type UpdateCourseBody = z.infer<typeof updateCourseSchema>;

// Esquemas de colección y consulta
export const sectionCollectionParams = z.object({
  courseId: z.string().uuid('Invalid course ID'),
});

export const sectionQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
});