import { describe, expect, it, vi } from 'vitest';
import { courseDb } from './course.db';
import { prisma } from '@/database/client';

vi.mock('@/database/client', () => ({
	prisma: {
		course: {
			findFirst: vi.fn(),
			findMany: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
		},
	},
}));

describe('courseDb operations', () => {
	it('busca un curso por su ID ignorando los eliminados', async () => {
		const mockCourse = { id: 'course-123', title: 'Matemáticas Discretas' };
		vi.mocked(prisma.course.findFirst).mockResolvedValue(mockCourse as any);

		const result = await courseDb.findById('course-123');

		expect(prisma.course.findFirst).toHaveBeenCalledWith({
			where: { id: 'course-123', deletedAt: null },
			include: { institution: true, instructor: true },
		});
		expect(result).toEqual(mockCourse);
	});

	it('crea un nuevo curso correctamente', async () => {
		const newCourseData = {
			title: 'Base de Datos II',
			institutionId: 'inst-456',
		};
		const createdMock = { id: 'course-999', ...newCourseData };
		vi.mocked(prisma.course.create).mockResolvedValue(createdMock as any);

		const result = await courseDb.create(newCourseData);

		expect(prisma.course.create).toHaveBeenCalledWith({
			data: {
				title: newCourseData.title,
				description: undefined,
				institutionId: newCourseData.institutionId,
				instructorId: undefined,
			},
		});
		expect(result).toEqual(createdMock);
	});
});