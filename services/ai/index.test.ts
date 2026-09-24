import { Prisma } from '@prisma/client'; 
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as repository from '@/database/ai';
import { AiInvalidResponseError } from '@/errors';
import type { AiProvider } from '@/lib/ai';
import { recommendStudySlots, summarizeUpcomingStudySessions } from './index';

vi.mock('@/database/ai', () => ({
	listAvailableCandidates: vi.fn(),
	listUpcomingOwnStudySessions: vi.fn(),
}));
vi.mock('@/lib/ai', () => ({ aiProvider: { complete: vi.fn() } }));

const slotId = '8c91a397-454d-4813-90ab-62f8b7854a82';
const resourceId = 'f92d75ca-e301-403e-9b34-b97d35db24f6';
const candidate = {
	id: slotId,
	startsAt: new Date('2030-01-02T18:00:00.000Z'),
	endsAt: new Date('2030-01-02T19:00:00.000Z'),
	resource: {
		id: resourceId,
		name: 'Sala de estudio A',
		description: null,
		address: 'Campus Universitario',
		hourlyPrice: new Prisma.Decimal(0),
		currency: 'USD',
		venue: { name: 'Campus Central', organization: { name: 'Universidad Estatal Amazónica' } },
	},
};

const input = { from: '2030-01-02T00:00:00.000Z', to: '2030-01-03T00:00:00.000Z' };

describe('AI services (EstudioApp)', () => {
	beforeEach(() => vi.clearAllMocks());

	it('no llama al proveedor cuando no existen candidatos disponibles', async () => {
		vi.mocked(repository.listAvailableCandidates).mockResolvedValue([]);
		const provider: AiProvider = { complete: vi.fn() };
		expect(await recommendStudySlots(input, provider)).toEqual({
			generated: false,
			explanation: '',
			recommendations: [],
		});
		expect(provider.complete).not.toHaveBeenCalled();
	});

	it('envía solo el contexto minimizado del candidato y mapea IDs verificados', async () => {
		vi.mocked(repository.listAvailableCandidates).mockResolvedValue([candidate]);
		const provider: AiProvider = {
			complete: vi.fn().mockResolvedValue(
				JSON.stringify({
					explanation: ' Un espacio de estudio disponible. ',
					recommendations: [{ availabilitySlotId: slotId, reason: ' Excelente horario para repaso. ' }],
				}),
			),
		};
		const result = await recommendStudySlots(input, provider);
		expect(result.recommendations[0]).toMatchObject({
			availabilitySlotId: slotId,
			resourceId,
			reason: 'Excelente horario para repaso.',
		});
		const request = vi.mocked(provider.complete).mock.calls[0][0];
		expect(JSON.stringify(request.context)).not.toMatch(
			/email|latitude|longitude|permissions|token/i,
		);
	});

	it('acepta JSON envuelto en bloque de código e ignora claves desconocidas del modelo', async () => {
		vi.mocked(repository.listAvailableCandidates).mockResolvedValue([candidate]);
		const body = JSON.stringify({
			explanation: 'Una opción.',
			recommendations: [{ availabilitySlotId: slotId, reason: 'Buen horario.', score: 9 }],
		});
		const provider: AiProvider = {
			complete: vi.fn().mockResolvedValue('```json\n' + body + '\n```'),
		};
		const result = await recommendStudySlots(input, provider);
		expect(result.recommendations).toHaveLength(1);
		expect(result.recommendations[0]).not.toHaveProperty('score');
	});

	it('rechaza referencias fuera del conjunto autorizado de candidatos', async () => {
		vi.mocked(repository.listAvailableCandidates).mockResolvedValue([candidate]);
		const provider: AiProvider = {
			complete: vi.fn().mockResolvedValue(
				JSON.stringify({
					explanation: 'Opción',
					recommendations: [{ availabilitySlotId: crypto.randomUUID(), reason: 'Inventada' }],
				}),
			),
		};
		await expect(recommendStudySlots(input, provider)).rejects.toBeInstanceOf(AiInvalidResponseError);
	});

	it('consulta y resume las sesiones de estudio usando el id del usuario autenticado', async () => {
		vi.mocked(repository.listUpcomingOwnStudySessions).mockResolvedValue([
			// En lugar de tener esto con 'resource':
// { id: '...', studySession: { ... }, resource: '...' }

    { 
    id: '1', 
    studySession: { 
        startsAt: new Date(), 
        endsAt: new Date() 
    } 
    }
		]);
		const provider: AiProvider = {
			complete: vi.fn().mockResolvedValue('{"summary":"Tienes una sesión de estudio programada."}'),
		};
		const result = await summarizeUpcomingStudySessions('current-user', { horizonDays: 7 }, provider);
		expect(repository.listUpcomingOwnStudySessions).toHaveBeenCalledWith('current-user', 7);
		expect(result).toEqual({ generated: true, summary: 'Tienes una sesión de estudio programada.', sessionsCount: 1 });
	});
});