import { prisma } from '@/database/client';
import { NotFoundError } from '@/errors/not-found-error';
import { normalizePagination } from '@/helper/pagination';

export const isStudySessionUniqueConstraintError = (error: unknown): boolean => {
	if (typeof error === 'object' && error !== null && 'code' in error) {
		return (error as { code: string }).code === 'P2002';
	}
	return false;
};

type TransactionClient = any;

const createTransactionRepository = (transaction: TransactionClient) => ({
	findStudySession: (sessionId: string) =>
		transaction.studySession.findFirst({
			where: { id: sessionId },
		}),

	createStudySession: (data: {
		courseId: string;
		status?: string;
		startsAt: Date;
		endsAt: Date;
	}) =>
		transaction.studySession.create({
			data: {
				...data,
				status: data.status ?? 'PUBLISHED',
			},
		}),

	updateStudySession: (sessionId: string, expectedUpdatedAt: Date, data: any) =>
		transaction.studySession.updateMany({
			where: { id: sessionId, updatedAt: expectedUpdatedAt },
			data,
		}),

	removeStudySession: (sessionId: string) =>
		transaction.studySession.delete({
			where: { id: sessionId },
		}),
});

export type StudySessionTransactionRepository = ReturnType<typeof createTransactionRepository>;

export const getAll = async (
	filters: { courseId?: string; status?: string; page?: number; pageSize?: number }
) => {
	const { skip, take, meta } = normalizePagination(filters);

	const where: any = {
		...(filters.courseId ? { courseId: filters.courseId } : {}),
		...(filters.status ? { status: filters.status } : {}),
	};

	const [sessions, total] = await Promise.all([
		prisma.studySession.findMany({
			where,
			include: {
				course: true,
				_count: { select: { bookings: true } },
			},
			skip,
			take,
			orderBy: { startsAt: 'asc' },
		}),
		prisma.studySession.count({ where }),
	]);

	const mappedSessions = sessions.map((session: any) => {
		const { _count, ...rest } = session;
		return { ...rest, bookingsCount: _count?.bookings ?? 0 };
	});

	return { sessions: mappedSessions, meta: meta(total) };
};

export const getUnique = async (sessionId: string) => {
	const record = await prisma.studySession.findFirst({
		where: { id: sessionId },
		include: {
			course: true,
			bookings: {
				include: { user: { include: { profile: true } } },
			},
		},
	});

	if (!record) {
		throw new NotFoundError('La sesión de estudio solicitada no existe.');
	}

	return record;
};

export const withTransaction = <T>(
	operation: (repository: StudySessionTransactionRepository) => Promise<T>,
) => prisma.$transaction(transaction => operation(createTransactionRepository(transaction)));