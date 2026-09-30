import { describe, expect, it } from 'vitest';
import { createStudySessionSchema, studySessionQuerySchema } from './index';

describe('Study Sessions Validations', () => {
	it('valida correctamente un cuerpo de creación válido', () => {
		const result = createStudySessionSchema.safeParse({
			title: 'Repaso de Redes',
			durationMinutes: 60,
			subject: 'Ingeniería de Sistemas',
		});
		expect(result.success).toBe(true);
	});

	it('falla si el título es muy corto', () => {
		const result = createStudySessionSchema.safeParse({
			title: 'Re',
		});
		expect(result.success).toBe(false);
	});
});