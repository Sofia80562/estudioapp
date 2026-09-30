import { prisma } from '@/lib/prisma';
import { NotFoundError } from '@/errors';

export const studySessionService = {
    async getAll(page: number = 1, pageSize: number = 10) {
        const skip = (page - 1) * pageSize;

        const [sessions, total] = await Promise.all([
            prisma.studySession.findMany({
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.studySession.count(),
        ]);

        return {
            sessions,
            meta: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    },

    async getById(sessionId: string) {
        const session = await prisma.studySession.findUnique({
            where: { id: sessionId },
        });

        if (!session) {
            throw new NotFoundError('Sesión de estudio no encontrada.');
        }

        return session;
    },

    async create(data: { title: string; durationMinutes?: number; subject?: string }, userId: string) {
        return await prisma.studySession.create({
            data: {
                ...data,
                // Si el campo en tu schema.prisma se llama studentId u otro, cámbialo aquí:
                userId: userId, 
            } as any, // 'as any' o el tipo correcto de tu schema por si el cliente exige un nombre exacto de FK
        });
    },

    async delete(sessionId: string) {
        await this.getById(sessionId);

        return await prisma.studySession.delete({
            where: { id: sessionId },
        });
    },
};