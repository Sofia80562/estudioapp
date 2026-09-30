import { z } from 'zod';

export const institucionQuerySchema = z.object({
	page: z
		.string()
		.optional()
		.default('1')
		.transform((val) => parseInt(val, 10))
		.pipe(z.number().min(1)),
	pageSize: z
		.string()
		.optional()
		.default('10')
		.transform((val) => parseInt(val, 10))
		.pipe(z.number().min(1).max(100)),
});

export const campusQuerySchema = institucionQuerySchema;

export const createInstitucionSchema = z.object({
	nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(150),
	siglas: z.string().min(1, 'Las siglas son requeridas').max(20).optional(),
});

export const institucionParamsSchema = z.object({
	institucionId: z.string().uuid('El ID de la institución debe ser un UUID válido'),
});