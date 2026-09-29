export * from './course.db';
export * from '@/validations/courses';

import { prisma } from '@/database/client';

export const sectionDb = {
    /**
     * Obtiene todas las secciones o clases asociadas a los cursos.
     */
    async getAll() {
        return prisma.section.findMany({
            include: {
                course: true,
                materials: true,
            },
        });
    },

    /**
     * Obtiene una sección específica por su ID con sus materiales de estudio.
     */
    async getUnique(sectionId: string) {
        return prisma.section.findUnique({
            where: { id: sectionId },
            include: {
                course: true,
                materials: true,
            },
        });
    },

    /**
     * Maneja transacciones seguras para crear o actualizar secciones y materiales.
     */
    async withTransaction<T>(fn: (repository: any) => Promise<T>): Promise<T> {
        return prisma.$transaction(async (tx: any) => {
            const repository = {
                async findSection(id: string) { 
                    return tx.section.findUnique({ where: { id } }); 
                },
                async createSection(data: any) { 
                    return tx.section.create({ data }); 
                },
                async updateSection(id: string, expectedUpdatedAt: Date, data: any) {
                    return tx.section.updateMany({ 
                        where: { id, updatedAt: expectedUpdatedAt }, 
                        data 
                    });
                },
                async getDetail(id: string) { 
                    return tx.section.findUnique({ 
                        where: { id },
                        include: { materials: true }
                    }); 
                },
                async removeWithCascade(id: string) { 
                    return tx.section.delete({ where: { id } }); 
                },
            };
            return fn(repository);
        });
    },
};