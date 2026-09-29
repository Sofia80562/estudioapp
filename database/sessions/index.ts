import { prisma } from '@/database/client';
import { NotFoundError } from '@/errors/not-found-error';

export const isSessionUniqueConstraintError = (error: unknown): boolean => {
	if (typeof error === 'object' && error !== null && 'code' in error) {
		return (error as { code: string }).code === 'P2002';
	}
	return false;
};

type TransactionClient = any;

const createTransactionRepository = (transaction: TransactionClient) => ({
	createSession: (data: {
		userId: string;
		sealedTokens: string;
		expiresAt: Date;
		revokedAt?: Date;
	}) =>
		transaction.userSession.create({
			data: {
				userId: data.userId,
				sealedTokens: data.sealedTokens,
				expiresAt: data.expiresAt,
				revokedAt: data.revokedAt ?? new Date(0), // Si no se revoca, colocamos fecha inicial por defecto
			},
		}),

	findActiveSessionById: (sessionId: string) =>
		transaction.userSession.findFirst({
			where: {
				id: sessionId,
				expiresAt: { gt: new Date() },
			},
			include: {
				user: {
					include: {
						profile: true,
						userRoles: {
							include: { role: true },
						},
					},
				},
			},
		}),

	updateSessionTokens: (sessionId: string, sealedTokens: string, expiresAt: Date) =>
		transaction.userSession.update({
			where: { id: sessionId },
			data: {
				sealedTokens,
				expiresAt,
				updatedAt: new Date(),
			},
		}),

	revokeSession: (sessionId: string) =>
		transaction.userSession.update({
			where: { id: sessionId },
			data: {
				revokedAt: new Date(),
			},
		}),

	revokeAllUserSessions: (userId: string) =>
		transaction.userSession.updateMany({
			where: { userId },
			data: {
				revokedAt: new Date(),
			},
		}),
});

export type SessionTransactionRepository = ReturnType<typeof createTransactionRepository>;

export const getSessionById = async (sessionId: string) => {
	const session = await prisma.userSession.findFirst({
		where: { id: sessionId },
		include: {
			user: {
				include: {
					profile: true,
					userRoles: {
						include: { role: true },
					},
				},
			},
		},
	});

	if (!session) {
		throw new NotFoundError('La sesión solicitada no existe.');
	}

	return session;
};

export const getUserActiveSessions = async (userId: string) => {
	return prisma.userSession.findMany({
		where: {
			userId,
			expiresAt: { gt: new Date() },
		},
		orderBy: { createdAt: 'desc' },
	});
};

export const withTransaction = <T>(
	operation: (repository: SessionTransactionRepository) => Promise<T>,
) => prisma.$transaction(transaction => operation(createTransactionRepository(transaction)));