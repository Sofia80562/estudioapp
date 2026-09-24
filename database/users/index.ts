import type { Prisma } from '@prisma/client';
import { Prisma as PrismaClient } from '@prisma/client';

import { prisma } from '@/database/client';
import { ConflictError } from '@/errors/conflict-error';
import { env } from '@/lib/config/env';
import { normalizePagination } from '@/helper/pagination';
import type { SessionPermission, SessionRole, SessionUser } from '@/lib/session';
import type { CreateUserBody, UpdateUserBody, UserQueryParams } from '@/validations/users';

type OAuthSyncUser = {
    user: SessionUser;
};

const isPrismaUniqueConstraintError = (
    error: unknown,
): error is PrismaClient.PrismaClientKnownRequestError =>
    error instanceof PrismaClient.PrismaClientKnownRequestError && error.code === 'P2002';

const splitDisplayName = (displayName: string): { firstName: string; lastName: string } => {
    const parts = displayName.trim().split(/\s+/u).filter(Boolean);

    if (parts.length === 0) {
        return { firstName: 'Usuario', lastName: 'OAuth' };
    }

    if (parts.length === 1) {
        return { firstName: parts[0], lastName: '' };
    }

    return {
        firstName: parts[0],
        lastName: parts.slice(1).join(' '),
    };
};

const buildDisplayName = (
    firstName: string | null | undefined,
    lastName: string | null | undefined,
    email: string,
): string => {
    const name = [firstName, lastName]
        .filter((value): value is string => Boolean(value && value.trim()))
        .join(' ')
        .trim();

    return name || email;
};

const mapRoles = (
    roles: Array<{ role: { id: string; code: string; name: string } }>,
): SessionRole[] =>
    roles.map(({ role }) => ({
        id: role.id,
        code: role.code,
        name: role.name,
    }));

const mapPermissions = (
    roles: Array<{
        role: {
            permissions: Array<{
                permission: { id: string; code: string };
            }>;
        };
    }>,
): SessionPermission[] => {
    const seen = new Map<string, SessionPermission>();

    for (const role of roles) {
        for (const granted of role.role.permissions) {
            seen.set(granted.permission.id, granted.permission);
        }
    }

    return [...seen.values()];
};

const loadUserWithAccess = async (userId: string) =>
    prisma.user.findUnique({
        where: { id: userId },
        include: {
            profile: true,
            userRoles: {
                include: {
                    role: {
                        include: {
                            permissions: {
                                include: {
                                    permission: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

export const getSessionUser = async (userId: string): Promise<SessionUser | null> => {
    const user = await loadUserWithAccess(userId);

    if (!user) {
        return null;
    }

    return {
        id: user.id,
        email: user.email,
        name: buildDisplayName(user.profile?.firstName, user.profile?.lastName, user.email),
        roles: mapRoles(user.userRoles),
        permissions: mapPermissions(user.userRoles),
    };
};

export const findOrSyncByOAuth = async (
    oauthSubject: string,
    email: string,
    name: string,
): Promise<OAuthSyncUser> => {
    const existingAccount = await prisma.authAccount.findUnique({
        where: {
            provider_providerAccountId: {
                provider: env.OAUTH_PROVIDER_NAME,
                providerAccountId: oauthSubject,
            },
        },
    });

    if (existingAccount) {
        const updatedUser = await prisma.user.update({
            where: { id: existingAccount.userId },
            data: {
                email,
                profile: {
                    upsert: {
                        create: splitDisplayName(name),
                        update: splitDisplayName(name),
                    },
                },
            },
        });

        const user = await loadUserWithAccess(updatedUser.id);

        if (!user) {
            throw new Error('User synchronization failed');
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                name: buildDisplayName(user.profile?.firstName, user.profile?.lastName, user.email),
                roles: mapRoles(user.userRoles),
                permissions: mapPermissions(user.userRoles),
            },
        };
    }

    const createdUser = await prisma.$transaction(async transaction => {
        const user = await transaction.user.create({
            data: {
                email,
                username: email.split('@')[0] || email,
                status: 'ACTIVE',
                profile: {
                    create: splitDisplayName(name),
                },
                authAccounts: {
                    create: {
                        provider: env.OAUTH_PROVIDER_NAME,
                        providerAccountId: oauthSubject,
                    },
                },
            },
        });

        return user;
    });

    const user = await loadUserWithAccess(createdUser.id);

    if (!user) {
        throw new Error('User synchronization failed');
    }

    return {
        user: {
            id: user.id,
            email: user.email,
            name: buildDisplayName(user.profile?.firstName, user.profile?.lastName, user.email),
            roles: mapRoles(user.userRoles),
            permissions: mapPermissions(user.userRoles),
        },
    };
};

const selectUserFields = {
    id: true,
    email: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    profile: true,
    userRoles: {
        include: {
            role: true,
        },
    },
};

export const getAll = async (filters: UserQueryParams) => {
    const { skip, take, meta } = normalizePagination(filters);

    const where: Prisma.UserWhereInput = {
        status: filters.active ? 'ACTIVE' : undefined,
    };

    if (filters.search) {
        where.OR = [
            { email: { contains: filters.search, mode: 'insensitive' } },
            { profile: { firstName: { contains: filters.search, mode: 'insensitive' } } },
            { profile: { lastName: { contains: filters.search, mode: 'insensitive' } } },
        ];
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: selectUserFields,
            skip,
            take,
            orderBy: filters.orderBy
                ? { [filters.orderBy]: filters.order ?? 'asc' }
                : { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
    ]);

    return { users, meta: meta(total) };
};

export const create = async (data: CreateUserBody) => {
    try {
        const user = await prisma.user.create({
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
            select: selectUserFields,
        });

        return user;
    } catch (error: unknown) {
        if (isPrismaUniqueConstraintError(error)) {
            throw new ConflictError('Ya existe un usuario con ese correo electrónico.');
        }

        throw error;
    }
};

export const getRolesByUserId = async (userId: string) => {
    const userRoles = await prisma.userRole.findMany({
        where: { userId },
        include: {
            role: true,
        },
    });

    return userRoles.map(ur => ur.role);
};

export const assignRolesToUser = async (userId: string, roles: Array<{ id: string }>) =>
    prisma.$transaction(async transaction => {
        await transaction.userRole.deleteMany({
            where: { userId },
        });

        if (roles.length > 0) {
            await transaction.userRole.createMany({
                data: roles.map(role => ({
                    userId,
                    roleId: role.id,
                })),
            });
        }
    });

export const addRolesToUser = async (userId: string, roles: Array<{ id: string }>) => {
    await prisma.userRole.createMany({
        data: roles.map(role => ({
            userId,
            roleId: role.id,
        })),
        skipDuplicates: true,
    });
};

export const addRoleToUser = async (userId: string, roleId: string) => {
    await prisma.userRole.create({
        data: { userId, roleId },
    });
};

export const removeRoleFromUser = async (userId: string, roleId: string): Promise<boolean> => {
    const result = await prisma.userRole.deleteMany({
        where: { userId, roleId },
    });
    return result.count > 0;
};

// --- Nuevas funciones requeridas por los servicios ---

export const getAssignableRoles = async (roleIds?: string[]) => {
    return prisma.role.findMany({
        where: roleIds ? { id: { in: roleIds } } : undefined,
    });
};

export const createWithRoles = async (data: CreateUserBody & { organizationId?: string }, roles: Array<{ id: string }>) => {
    return prisma.user.create({
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
            userRoles: {
                create: roles.map(role => ({
                    roleId: role.id,
                })),
            },
        },
        include: {
            profile: true,
            userRoles: {
                include: { role: true },
            },
        },
    });
};

export const getAdminProfile = async (userId: string) => {
    return prisma.user.findUnique({
        where: { id: userId },
        include: {
            profile: true,
        },
    });
};

export const updateAdminProfile = async (userId: string, body: any, _isAdmin: boolean) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
    });

    if (!user) {
        return { outcome: 'NOT_FOUND' as const };
    }

    if (user.status !== 'ACTIVE') {
        return { outcome: 'INACTIVE' as const };
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            profile: {
                update: {
                    ...(body.firstName && { firstName: body.firstName }),
                    ...(body.lastName && { lastName: body.lastName }),
                },
            },
        },
        include: { profile: true },
    });

    return { outcome: 'UPDATED' as const, user: updatedUser };
};

export const getOwnProfile = async (userId: string) => {
    return prisma.userProfile.findUnique({
        where: { userId },
    });
};

export const updateOwnProfile = async (userId: string, body: any) => {
    try {
        return await prisma.userProfile.update({
            where: { userId },
            data: { ...body },
        });
    } catch {
        return null;
    }
};

export const getOwnAvatar = async (userId: string) => {
    return prisma.userProfile.findUnique({
        where: { userId },
        select: {
            avatarData: true,
            avatarMimeType: true,
            avatarUpdatedAt: true,
        },
    });
};

export const updateOwnAvatar = async (userId: string, avatar: { data: Buffer | string; mimeType: string }) => {
    return prisma.userProfile.update({
        where: { userId },
        data: {
            avatarData: avatar.data as any,
            avatarMimeType: avatar.mimeType,
            avatarUpdatedAt: new Date(),
        },
    });
};

export const removeOwnAvatar = async (userId: string) => {
    try {
        await prisma.userProfile.update({
            where: { userId },
            data: {
                avatarData: null,
                avatarMimeType: null,
                avatarUpdatedAt: null,
            },
        });
        return { count: 1 };
    } catch {
        return { count: 0 };
    }
};

export const updateWithRoles = async (userId: string, data: any, roles?: Array<{ id: string }>) => {
    return prisma.$transaction(async tx => {
        if (roles !== undefined) {
            await tx.userRole.deleteMany({ where: { userId } });
            if (roles.length > 0) {
                await tx.userRole.createMany({
                    data: roles.map(role => ({ userId, roleId: role.id })),
                });
            }
        }

        const user = await tx.user.update({
            where: { id: userId },
            data: {
                ...(data.email && { email: data.email }),
                ...(data.firstName || data.lastName
                    ? {
                        profile: {
                            update: {
                                ...(data.firstName && { firstName: data.firstName }),
                                ...(data.lastName && { lastName: data.lastName }),
                            },
                        },
                    }
                    : {}),
            },
            include: {
                profile: true,
                userRoles: {
                    include: { role: true },
                },
            },
        });
        return user;
    });
};

export const record = (userId: string) => ({
    getUnique: async () =>
        prisma.user.findUnique({
            where: { id: userId },
            select: selectUserFields,
        }),
    update: async (data: UpdateUserBody) =>
        prisma.user.update({
            where: { id: userId },
            data: {
                ...(data.email && { email: data.email }),
                ...(data.firstName || data.lastName
                    ? {
                            profile: {
                                update: {
                                    ...(data.firstName && { firstName: data.firstName }),
                                    ...(data.lastName && { lastName: data.lastName }),
                                },
                            },
                        }
                    : {}),
            },
            select: selectUserFields,
        }),
    remove: async () =>
        prisma.user.update({
            where: { id: userId },
            data: {
                status: 'INACTIVE',
            },
            select: selectUserFields,
        }),
})

export async function createFromRegistration(
    keycloakId: string, 
    profile: { email: string; firstName: string; lastName: string }, 
    roleId: string
) {
    return (prisma as any).user.create({
        data: {
            keycloakId,
            email: profile.email,
            roles: { connect: { id: roleId } },
            profile: {
                create: {
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                },
            },
        },
        include: { profile: true },
    });
}