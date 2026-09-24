import { Prisma } from '@/generated/prisma';
import { prisma } from '@/database/client';
import { AI_MAX_CANDIDATES } from '@/validations/ai';
import type { StudySlotRecommendationsBody } from '@/validations/ai';

export const listAvailableCandidates = async (input: StudySlotRecommendationsBody) => {
    const sessions = await prisma.studySession.findMany({
        where: {
            status: 'PUBLISHED',
            startsAt: { gte: new Date(input.from), lte: new Date(input.to) },
        },
        select: {
            id: true,
            startsAt: true,
            endsAt: true,
            // Si ya tienes la relación con cursos en tu esquema, descomenta esto:
            /*
            course: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                },
            },
            */
        },
        orderBy: { startsAt: 'asc' },
        take: AI_MAX_CANDIDATES * 3,
    });
    return sessions.slice(0, AI_MAX_CANDIDATES);
};

export const listUpcomingOwnStudySessions = (userId: string, horizonDays: number) => {
    const until = new Date(Date.now() + horizonDays * 24 * 60 * 60 * 1000);
    return prisma.studySessionBooking.findMany({
        where: {
            userId,
            status: 'CONFIRMED',
            studySession: { startsAt: { gt: new Date(), lte: until } },
        },
        select: {
            id: true,
            studySession: { select: { startsAt: true, endsAt: true } },
        },
        orderBy: { studySession: { startsAt: 'asc' } },
        take: AI_MAX_CANDIDATES,
    });
};