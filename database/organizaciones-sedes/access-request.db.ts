import type { Prisma } from '@prisma/client';
import { Prisma as PrismaClient } from '@prisma/client';

import { prisma } from '@/database/client';
import { ConflictError } from '@/errors/conflict-error';
import { NotFoundError } from '@/errors/not-found-error';
import { env } from '@/lib/config/env';
import { normalizePagination } from '@/helper/pagination';
import { normalizeOrganizationIdentity } from '@/helper/organizaciones';

const isPrismaUniqueConstraintError = (
    error: unknown,
): error is PrismaClient.PrismaClientKnownRequestError =>
    error instanceof PrismaClient.PrismaClientKnownRequestError && error.code === 'P2002';

const GESTOR_ROLE_NAME = 'Gestor de Cancha';
const GESTOR_ROLE_CODE = 'gestor-de-cancha';
const GESTOR_ROLE_NORMALIZED_NAME = 'gestor de cancha';

const selectAccessRequestFields = {
    id: true,
    status: true,
    createdAt: true,
    reviewedAt: true,
    rejectionReason: true,
    organization: {
        select: {
            id: true,
            name: true,
            status: true,
            venues: { select: { id: true, name: true, status: true } },
        },
    },
    requester: {
        select: {
            id: true,
            email: true,
            profile: { select: { firstName: true, lastName: true } },
        },
    },
} satisfies Prisma.OrganizationAccessRequestSelect;

export type OrganizationInput = {
    name: string;
    legalName?: string;
    taxIdentification?: string;
    email?: string;
    phone?: string;
    domain?: string;
};

export type VenueInput = {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
};

export type RegisteringUser = {
    email: string;
    firstName: string;
    lastName: string;
};

export const createUserWithAccessRequest = async (
    keycloakId: string,
    user: RegisteringUser,
    organization: OrganizationInput,
    venue: VenueInput,
) => {
    try {
        return await prisma.$transaction(async transaction => {
            const createdUser = await transaction.user.create({
                data: {
                    email: user.email,
                    username: user.email.split('@')[0] || user.email,
                    status: 'ACTIVE',
                    profile: { create: { firstName: user.firstName, lastName: user.lastName } },
                    authAccounts: {
                        create: { provider: env.OAUTH_PROVIDER_NAME, providerAccountId: keycloakId },
                    },
                },
            });

            const createdOrganization = await transaction.organization.create({
                data: {
                    name: organization.name,
                    normalizedName: normalizeOrganizationIdentity(organization.name),
                    legalName: organization.legalName || null,
                    taxIdentification: organization.taxIdentification || null,
                    email: organization.email || null,
                    phone: organization.phone || null,
                    domain: organization.domain || null,
                    status: 'PENDING_APPROVAL',
                },
            });

            await transaction.venue.create({
                data: {
                    organizationId: createdOrganization.id,
                    name: venue.name,
                    address: venue.address || null,
                    phone: venue.phone || null,
                    email: venue.email || null,
                    status: 'PENDING_APPROVAL',
                },
            });

            const accessRequest = await transaction.organizationAccessRequest.create({
                data: { organizationId: createdOrganization.id, userId: createdUser.id, status: 'PENDING' },
                select: selectAccessRequestFields,
            });

            return { user: createdUser, accessRequest };
        });
    } catch (error) {
        if (isPrismaUniqueConstraintError(error)) {
            const target = error.meta?.target;
            const fields = Array.isArray(target) ? target : typeof target === 'string' ? [target] : [];

            if (fields.some(field => String(field).includes('normalized_name'))) {
                throw new ConflictError('Ya existe una organización con ese nombre.');
            }

            throw new ConflictError('Ya existe una cuenta con ese correo electrónico.');
        }

        throw error;
    }
};

export const getAccessRequests = async (
    status: 'PENDING' | 'APPROVED' | 'REJECTED',
    page: number,
    pageSize: number,
) => {
    const { skip, take, meta } = normalizePagination({ page, pageSize });
    const where: Prisma.OrganizationAccessRequestWhereInput = { status };

    const [requests, total] = await Promise.all([
        prisma.organizationAccessRequest.findMany({
            where,
            select: selectAccessRequestFields,
            skip,
            take,
            orderBy: { createdAt: 'asc' },
        }),
        prisma.organizationAccessRequest.count({ where }),
    ]);

    return { requests, meta: meta(total) };
};

export const getAccessRequestById = async (requestId: string) => {
    const request = await prisma.organizationAccessRequest.findUnique({
        where: { id: requestId },
        select: selectAccessRequestFields,
    });

    if (!request) {
        throw new NotFoundError('La solicitud indicada no existe.');
    }

    return request;
};

export const approveAccessRequest = async (requestId: string, reviewerUserId: string) =>
    prisma.$transaction(async transaction => {
        const request = await transaction.organizationAccessRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            throw new NotFoundError('La solicitud indicada no existe.');
        }

        if (request.status !== 'PENDING') {
            throw new ConflictError('Esta solicitud ya fue revisada.');
        }

        await transaction.organization.update({
            where: { id: request.organizationId },
            data: { status: 'ACTIVE' },
        });

        await transaction.venue.updateMany({
            where: { organizationId: request.organizationId },
            data: { status: 'ACTIVE' },
        });

        let gestorRole = await transaction.role.findFirst({
            where: {
                organizationId: request.organizationId,
                normalizedName: GESTOR_ROLE_NORMALIZED_NAME,
                deletedAt: null,
            },
        });

        if (!gestorRole) {
            gestorRole = await transaction.role.create({
                data: {
                    organizationId: request.organizationId,
                    name: GESTOR_ROLE_NAME,
                    normalizedName: GESTOR_ROLE_NORMALIZED_NAME,
                    code: GESTOR_ROLE_CODE,
                    isSystem: true,
                },
            });
        }

        await transaction.userRole.create({
            data: {
                userId: request.userId,
                roleId: gestorRole.id,
                organizationId: request.organizationId,
            },
        });

        return transaction.organizationAccessRequest.update({
            where: { id: requestId },
            data: { status: 'APPROVED', reviewedAt: new Date(), reviewedByUserId: reviewerUserId },
            select: selectAccessRequestFields,
        });
    });

export const rejectAccessRequest = async (
    requestId: string,
    reviewerUserId: string,
    reason?: string,
) =>
    prisma.$transaction(async transaction => {
        const request = await transaction.organizationAccessRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            throw new NotFoundError('La solicitud indicada no existe.');
        }

        if (request.status !== 'PENDING') {
            throw new ConflictError('Esta solicitud ya fue revisada.');
        }

        return transaction.organizationAccessRequest.update({
            where: { id: requestId },
            data: {
                status: 'REJECTED',
                reviewedAt: new Date(),
                reviewedByUserId: reviewerUserId,
                rejectionReason: reason || null,
            },
            select: selectAccessRequestFields,
        });
    });