import { prisma } from '@/database/client';

export interface CreateCourseData {
    title: string;
    code?: string; // <-- Cambiado a opcional para los tests
    description?: string;
    credits?: number;
    semester?: number;
    institutionId?: string;
    status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateCourseData {
    title?: string;
    code?: string;
    description?: string;
    credits?: number;
    semester?: number;
    status?: 'ACTIVE' | 'INACTIVE';
}

export const isCourseUniqueConstraintError = (error: unknown): boolean => {
    if (typeof error === 'object' && error !== null && 'code' in error) {
        return (error as { code: string }).code === 'P2002';
    }
    return false;
};

export const courseDb = {
    async findById(courseId: string) {
        return prisma.course.findFirst({
            where: { id: courseId, deletedAt: null },
            include: { institution: true },
        });
    },

    async getUnique(courseId: string) {
        return this.findById(courseId);
    },

    async getAll() {
        return prisma.course.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
            include: { institution: true },
        });
    },

    async findManyByInstitution(institutionId: string) {
        return prisma.course.findMany({
            where: { institutionId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    },

    async actorHasCourseScope(courseId: string, organizationId: string): Promise<boolean> {
        const course = await prisma.course.findFirst({
            where: { id: courseId, deletedAt: null, institutionId: organizationId },
        });
        return !!course;
    },

    async create(data: CreateCourseData) {
        return prisma.course.create({
            data: {
                title: data.title,
                code: data.code ?? `CRS-${Date.now()}`, // Autogenera un código si el test no lo provee
                description: data.description,
                credits: data.credits,
                semester: data.semester,
                status: data.status ?? 'ACTIVE',
                institutionId: data.institutionId,
            },
        });
    },

    async update(courseId: string, data: UpdateCourseData) {
        return prisma.course.update({
            where: { id: courseId },
            data,
        });
    },

    async softDelete(courseId: string) {
        return prisma.course.update({
            where: { id: courseId },
            data: { deletedAt: new Date(), status: 'INACTIVE' },
        });
    },

    async withTransaction<T>(operation: (tx: any) => Promise<T>): Promise<T> {
        return prisma.$transaction(operation);
    },
};