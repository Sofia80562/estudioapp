import { prisma } from '@/database/client';

/**
 * Obtiene el resumen académico y de tareas del usuario para que la IA
 * pueda darle recomendaciones de estudio personalizadas.
 */
export const getUserStudyContextForAI = async (userId: string) => {
	// 1. Buscar las tareas pendientes o en progreso del estudiante
	const pendingTasks = await prisma.task.findMany({
		where: {
			userId,
			status: { not: 'COMPLETED' },
		},
		select: {
			id: true,
			title: true,
			description: true,
			priority: true,
			dueDate: true,
		},
		orderBy: { dueDate: 'asc' },
		take: 10,
	});

	// 2. Buscar los cursos en los que está inscrito el estudiante a través de sus secciones
	const userBookings = await prisma.studySessionBooking.findMany({
		where: { userId, status: 'CONFIRMED' },
		include: {
			studySession: {
				include: {
					course: {
						select: {
							title: true,
							code: true,
						},
					},
				},
			},
		},
		take: 5,
	});

	// 3. Obtener el historial reciente de tiempo de estudio (cronómetro)
	const recentStudyLogs = await prisma.studyTimeLog.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' },
		take: 5,
		select: {
			durationMinutes: true,
			sessionType: true,
			createdAt: true,
		},
	});

	return {
		pendingTasks,
		enrolledCourses: userBookings.map((b) => b.studySession.course),
		recentStudyLogs,
	};
};