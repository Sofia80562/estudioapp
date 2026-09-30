import { prisma } from '@/lib/prisma';

export const aiService = {
	async getStudyProgressSummary(userId: string) {
		// Se consulta usando la relación o el nombre de campo correcto según tu schema
		const sessions = await prisma.studySession.findMany({
			where: { 
				userId: userId, 
			} as any,
		});

		const totalSessions = sessions.length;

		return {
			totalSessions,
			summary: `El usuario ha completado ${totalSessions} sesiones de estudio registradas.`,
		};
	},
};