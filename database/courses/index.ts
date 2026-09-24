export * from './course.db';
export * from '@/validations/courses';

import { prisma } from '@/database/client';

export const sectionDb = {
    async getAll(filters: any, context: any) {
        return { items: [], meta: { total: 0, page: 1, pageSize: 20, totalPages: 1 } };
    },
    async getUnique(sectionId: string) {
        return prisma.section.findUnique({ where: { id: sectionId } });
    },
    async withTransaction<T>(fn: (repository: any) => Promise<T>): Promise<T> {
        return prisma.$transaction(async (tx: any) => {
            const repository = {
                async findSection(id: string) { return tx.section.findUnique({ where: { id } }); },
                async createSection(data: any) { return tx.section.create({ data }); },
                async updateSection(id: string, expectedUpdatedAt: Date, data: any) {
                    return tx.section.updateMany({ where: { id, updatedAt: expectedUpdatedAt }, data });
                },
                async getDetail(id: string) { return tx.section.findUnique({ where: { id } }); },
                async removeWithCascade(id: string) { return tx.section.delete({ where: { id } }); },
            };
            return fn(repository);
        });
    },
};

export const accessRequestDb = {
    async createUserWithAccessRequest(keycloakId: string, profile: any, organization: any, venue: any) {
        return prisma.$transaction(async (tx: any) => {
            const user = await tx.user.create({
                data: {
                    keycloakId,
                    email: profile.email,
                    profile: { create: { firstName: profile.firstName, lastName: profile.lastName } },
                },
            });
            const accessRequest = await tx.accessRequest.create({
                data: {
                    userId: user.id,
                    organizationName: organization.name,
                    venueName: venue.name,
                    status: 'PENDING_APPROVAL',
                },
            });
            return { user, accessRequest };
        });
    },
};