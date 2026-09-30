import { z } from 'zod';

export const studyProgressQuerySchema = z
	.object({
		timeframe: z.enum(['week', 'month', 'year']).default('week'),
	})
	.strict();

export type StudyProgressQuery = z.infer<typeof studyProgressQuerySchema>;