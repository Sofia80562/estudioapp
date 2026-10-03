export * from './course.db';
export * from '@/validations/courses';

import type { Prisma } from '@/generated/prisma';
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
        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

export const accessRequestDb = {
    /**
     * Crea una nueva solicitud de acceso a cursos o instituciones.
     */
    async create(data: { userId: string; organizationId?: string; status?: string }) {
        return prisma.accessRequest.create({
            data: {
                userId: data.userId,
                organizationId: data.organizationId,
                status: data.status ?? 'PENDING_APPROVAL',
            },
        });
    },

    /**
     * Obtiene una solicitud de acceso por su ID.
     */
    async getUnique(id: string) {
        return prisma.accessRequest.findUnique({
            where: { id },
        });
    },

    /**
     * Crea un usuario y su solicitud de acceso de forma transaccional.
     */
    async createUserWithAccessRequest(data: {
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        organizationId?: string;
    }) {
        return prisma.$transaction(async (tx: any) => {
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    username: data.email.split('@')[0] || data.email,
                    status: 'ACTIVE',
                    profile: {
                        create: {
                            firstName: data.firstName,
                            lastName: data.lastName,
                        },
                    },
                },
            });

            const accessRequest = await tx.accessRequest.create({
                data: {
                    userId: user.id,
                    organizationId: data.organizationId,
                    status: 'PENDING_APPROVAL',
                },
            });

            return { user, accessRequest };
        });
    },
};