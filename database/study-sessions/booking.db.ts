import { prisma } from '@/database/client';
import { NotFoundError } from '@/errors/not-found-error';

export const isBookingUniqueConstraintError = (error: unknown): boolean => {
	if (typeof error === 'object' && error !== null && 'code' in error) {
		return (error as { code: string }).code === 'P2002';
	}
	return false;
};

type TransactionClient = any;

const createTransactionRepository = (transaction: TransactionClient) => ({
	createBooking: (data: { studySessionId: string; userId: string; status?: string }) =>
		transaction.studySessionBooking.create({
			data: {
				studySessionId: data.studySessionId,
				userId: data.userId,
				status: data.status ?? 'CONFIRMED',
			},
		}),

	removeBooking: (bookingId: string) =>
		transaction.studySessionBooking.delete({
			where: { id: bookingId },
		}),
});

export type BookingTransactionRepository = ReturnType<typeof createTransactionRepository>;

export const getBookingsByUser = async (userId: string) => {
	return prisma.studySessionBooking.findMany({
		where: { userId },
		include: {
			studySession: {
				include: { course: true },
			},
		},
		orderBy: { createdAt: 'desc' },
	});
};

export const withTransaction = <T>(
	operation: (repository: BookingTransactionRepository) => Promise<T>,
) => prisma.$transaction(transaction => operation(createTransactionRepository(transaction)));