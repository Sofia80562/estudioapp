import { z } from 'zod';

export const studySessionQuerySchema = z.object({
	page: z
		.string()
		.optional()
		.default('1')
		.transform((val) => parseInt(val, 10))
		.pipe(z.number().min(1, 'La página debe ser mayor o igual a 1')),
	pageSize: z
		.string()
		.optional()
		.default('10')
		.transform((val) => parseInt(val, 10))
		.pipe(z.number().min(1).max(100, 'El tamaño de página no puede exceder 100')),
});

export const createStudySessionSchema = z.object({
	title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(100),
	durationMinutes: z.number().int().positive('La duración en minutos debe ser positiva').optional(),
	subject: z.string().min(2, 'La materia o asignatura es requerida').optional(),
});

export const studySessionParamsSchema = z.object({
	sessionId: z.string().uuid('El ID de la sesión de estudio debe ser un UUID válido'),
});