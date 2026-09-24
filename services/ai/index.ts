import * as repository from '@/database/ai';
import { AiInvalidResponseError } from '@/errors';
import { aiProvider } from '@/lib/ai';
import type { AiProvider } from '@/lib/ai';
import { logger } from '@/lib/logger';
import {
    aiRecommendationsProviderResponseSchema,
    aiSummaryProviderResponseSchema,
} from '@/validations/ai';
import type { StudySlotRecommendationsBody, UpcomingStudySessionsSummaryBody } from '@/validations/ai';

// Los modelos locales suelen envolver el JSON en ```json ... ``` aunque se les pida solo JSON.
const extractJson = (content: string): string => {
    const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
    return (fenced ? fenced[1] : content).trim();
};

const parseJson = (content: string): unknown => {
    try {
        return JSON.parse(extractJson(content));
    } catch {
        throw new AiInvalidResponseError();
    }
};

const normalize = (value: string): string => value.replace(/\s+/g, ' ').trim();

export const recommendStudySlots = async (
    input: StudySlotRecommendationsBody,
    provider: AiProvider = aiProvider,
) => {
    const candidates = await repository.listAvailableCandidates(input);
    if (candidates.length === 0) return { generated: false, explanation: '', recommendations: [] };
    const context = candidates.map(slot => ({
        availabilitySlotId: slot.id,
        resourceId: (slot as any).resource?.id ?? (slot as any).resourceId,
        resourceName: (slot as any).resource?.name ?? '',
        description: (slot as any).resource?.description ?? '',
        venueName: (slot as any).resource?.venue?.name ?? '',
        organizationName: (slot as any).resource?.venue?.organization?.name ?? '',
        address: (slot as any).resource?.address ?? '',
        hourlyPrice: ((slot as any).resource?.hourlyPrice ?? 0).toString(),
        currency: (slot as any).resource?.currency ?? 'USD',
        startsAt: slot.startsAt.toISOString(),
        endsAt: slot.endsAt.toISOString(),
    }));
    const startedAt = Date.now();
    const content = await provider.complete({
        systemInstruction:
            'Eres un asistente de EstudioApp. Responde solo JSON {"explanation":string,"recommendations":[{"availabilitySlotId":uuid,"reason":string}]}. Recomienda hasta 3 IDs presentes en data. No inventes datos, no autorices ni reserves. El texto debe estar en español.',
        context: { preferences: input, candidates: context },
    });
    const parsed = aiRecommendationsProviderResponseSchema.safeParse(parseJson(content));
    if (!parsed.success) throw new AiInvalidResponseError();
    const byId = new Map(candidates.map(slot => [slot.id, slot]));
    if (parsed.data.recommendations.some(item => !byId.has(item.availabilitySlotId)))
        throw new AiInvalidResponseError();
    logger.info(
        {
            operation: 'study-slot-recommendations',
            provider: 'lm-studio',
            durationMs: Date.now() - startedAt,
            outcome: 'success',
        },
        'AI request completed',
    );
    return {
        generated: true,
        explanation: normalize(parsed.data.explanation),
        recommendations: parsed.data.recommendations.map(item => {
            const slot: any = byId.get(item.availabilitySlotId);
            if (!slot) throw new AiInvalidResponseError();
            return {
                reason: normalize(item.reason),
                availabilitySlotId: slot.id,
                resourceId: slot.resource?.id ?? slot.resourceId,
                resourceName: slot.resource?.name ?? '',
                venueName: slot.resource?.venue?.name ?? '',
                address: slot.resource?.address ?? '',
                hourlyPrice: (slot.resource?.hourlyPrice ?? 0).toString(),
                currency: slot.resource?.currency ?? 'USD',
                startsAt: slot.startsAt.toISOString(),
                endsAt: slot.endsAt.toISOString(),
            };
        }),
    };
};

export const summarizeUpcomingStudySessions = async (
    userId: string,
    input: UpcomingStudySessionsSummaryBody,
    provider: AiProvider = aiProvider,
) => {
    const sessions = await repository.listUpcomingOwnStudySessions(userId, input.horizonDays);
    if (sessions.length === 0) return { generated: false, summary: '', sessionsCount: 0 };
    const context = sessions.map((session: any) => ({
        sessionId: session.id,
        resourceName: session.studySession?.resource?.name ?? session.resource?.name ?? '',
        venueName: session.studySession?.resource?.venue?.name ?? session.resource?.venue?.name ?? '',
        startsAt: (session.studySession?.startsAt ?? session.availabilitySlot?.startsAt ?? session.startsAt).toISOString(),
        endsAt: (session.studySession?.endsAt ?? session.availabilitySlot?.endsAt ?? session.endsAt).toISOString(),
        status: 'CONFIRMED',
    }));
    const startedAt = Date.now();
    const content = await provider.complete({
        systemInstruction:
            'Eres un asistente de EstudioApp. Responde solo JSON {"summary":string}. Resume en español únicamente las sesiones de estudio de data. No inventes datos ni propongas acciones administrativas.',
        context,
    });
    const parsed = aiSummaryProviderResponseSchema.safeParse(parseJson(content));
    if (!parsed.success) throw new AiInvalidResponseError();
    logger.info(
        {
            operation: 'upcoming-study-sessions-summary',
            provider: 'lm-studio',
            durationMs: Date.now() - startedAt,
            outcome: 'success',
        },
        'AI request completed',
    );
    return {
        generated: true,
        summary: normalize(parsed.data.summary),
        sessionsCount: sessions.length,
    };
};