import { sectionDb } from '@/database/courses';
import { AuthorizationError, ConflictError, NotFoundError } from '@/errors';
import { normalizeSectionName } from '@/helper/courses';
import type { SessionUser } from '@/lib/session';
import { isAdministrator } from '@/services/users/role-guard';
import type {
    CreateSectionBody,
    SectionParams,
    UpdateSectionBody,
} from '@/validations/courses';

export const ensureSectionScope = async (
    actingUser: SessionUser,
    sectionId: string,
    opaque = false,
): Promise<void> => {
    if (isAdministrator(actingUser)) return;

    const hasScope = await sectionDb.getUnique(sectionId);
    if (hasScope) return;

    if (opaque) {
        throw new NotFoundError('La sección solicitada no existe.');
    }

    throw new AuthorizationError('No tienes acceso a esta sección.');
};

export const getAll = async (
    courseId: string,
    filters: SectionParams,
    actingUser: SessionUser,
) =>
    sectionDb.getAll(
        { ...filters, courseId },
        {
            userId: actingUser.id,
            isAdministrator: isAdministrator(actingUser),
        },
    );

export const getById = async (sectionId: string, actingUser: SessionUser) => {
    await ensureSectionScope(actingUser, sectionId, true);
    return sectionDb.getUnique(sectionId);
};

export const create = async (
    courseId: string,
    data: CreateSectionBody,
    actingUser: SessionUser,
) => {
    try {
        return await sectionDb.withTransaction(async (repository: any) => {
            const section = await repository.createSection({
                name: normalizeSectionName(data.name),
                description: data.description ?? null,
                courseId: courseId,
            });

            return section;
        });
    } catch (error) {
        if ((error as any)?.code === 'P2002') {
            throw new ConflictError('Ya existe una sección con ese nombre.');
        }
        throw error;
    }
};

export const update = async (
    sectionId: string,
    data: UpdateSectionBody,
    actingUser: SessionUser,
) => {
    await ensureSectionScope(actingUser, sectionId, true);

    try {
        return await sectionDb.withTransaction(
            async (repository: any) => {
                const current = await repository.findSection(sectionId);
                if (!current) {
                    throw new NotFoundError('La sección solicitada no existe.');
                }

                const { expectedUpdatedAt, ...editable } = data;

                const updateResult = await repository.updateSection(
                    sectionId,
                    expectedUpdatedAt ? new Date(expectedUpdatedAt) : new Date(),
                    {
                        ...(editable.name !== undefined
                            ? { name: normalizeSectionName(editable.name) }
                            : {}),
                        ...(editable.description !== undefined
                            ? { description: editable.description }
                            : {}),
                        updatedAt: new Date(),
                    },
                );

                if (updateResult.count === 0) {
                    throw new ConflictError(
                        'La sección cambió desde que la abriste. Recarga los datos antes de guardar.',
                    );
                }

                return repository.getDetail(sectionId);
            },
        );
    } catch (error) {
        if ((error as any)?.code === 'P2002') {
            throw new ConflictError('Ya existe una sección con ese nombre.');
        }
        throw error;
    }
};

export const remove = async (sectionId: string, actingUser: SessionUser) => {
    await ensureSectionScope(actingUser, sectionId, true);

    return sectionDb.withTransaction(async (repository: any) => {
        const current = await repository.findSection(sectionId);
        if (!current) {
            throw new NotFoundError('La sección solicitada no existe.');
        }

        return repository.removeWithCascade(sectionId);
    });
};