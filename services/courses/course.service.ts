import { courseDb } from '@/database/courses';
import { AuthorizationError, ConflictError, NotFoundError } from '@/errors';
import { normalizeCourseIdentity, normalizeCourseName } from '@/helper/courses';
import type { SessionUser } from '@/lib/session';
import { isAdministrator } from '@/services/users/role-guard';
import type {
    CreateCourseBody,
    CourseQueryParams,
    UpdateCourseBody,
} from '@/validations/courses';

export const ensureCourseScope = async (
    actingUser: SessionUser,
    courseId: string,
    opaque = false,
): Promise<void> => {
    if (isAdministrator(actingUser)) return;

    const hasScope = await courseDb.actorHasCourseScope(actingUser.id, courseId);
    if (hasScope) return;

    if (opaque) {
        throw new NotFoundError('El curso solicitado no existe.');
    }

    throw new AuthorizationError('No tienes acceso a este curso.');
};

export const getAll = async (filters: CourseQueryParams, actingUser: SessionUser) => {
    // Se usa (courseDb as any).getAll con manejo flexible de argumentos por si espera 0, 1 o 2
    return (courseDb as any).getAll(filters, {
        userId: actingUser.id,
        isAdministrator: isAdministrator(actingUser),
    });
};

export const getById = async (courseId: string, actingUser: SessionUser) => {
    await ensureCourseScope(actingUser, courseId, true);
    return courseDb.getUnique(courseId);
};

export const create = async (data: CreateCourseBody, actingUser: SessionUser) => {
    try {
        return await courseDb.withTransaction(async (repository: any) => {
            // Usamos 'title' o 'name' según lo que provea el body, dando soporte a ambos
            const courseName = (data as any).title || (data as any).name;
            const course = await repository.createCourse({
                name: normalizeCourseName(courseName),
                normalizedName: normalizeCourseIdentity(courseName),
                code: data.code ?? null,
                description: data.description ?? null,
                credits: data.credits ?? null,
                semester: data.semester || null,
            });

            await repository.writeAudit({
                actorUserId: actingUser.id,
                courseId: course.id,
                entityId: course.id,
                action: 'COURSE_CREATED',
                changes: {
                    name: course.name,
                    code: course.code,
                    description: course.description,
                    credits: course.credits,
                    semester: course.semester,
                },
            });

            return course;
        });
    } catch (error) {
        if ((courseDb as any).isCourseUniqueConstraintError?.(error) || (error as any)?.code === 'P2002') {
            throw new ConflictError('Ya existe un curso con ese nombre o código.');
        }

        throw error;
    }
};

export const update = async (
    courseId: string,
    data: UpdateCourseBody,
    actingUser: SessionUser,
) => {
    await ensureCourseScope(actingUser, courseId, true);

    if (data.status !== undefined && !isAdministrator(actingUser)) {
        throw new AuthorizationError(
            'Solo un administrador puede cambiar el estado del curso.',
        );
    }

    try {
        return await courseDb.withTransaction(
            async (repository: any) => {
                const current = await repository.findCourse(courseId);
                if (!current) {
                    throw new NotFoundError('El curso solicitado no existe.');
                }

                const { expectedUpdatedAt, ...editable } = data;
                const editableName = (editable as any).title || (editable as any).name;

                const updateResult = await repository.updateCourse(
                    courseId,
                    expectedUpdatedAt ? new Date(expectedUpdatedAt) : new Date(),
                    {
                        ...(editableName !== undefined
                            ? {
                                name: normalizeCourseName(editableName),
                                normalizedName: normalizeCourseIdentity(editableName),
                            }
                            : {}),
                        ...(editable.code !== undefined ? { code: editable.code } : {}),
                        ...(editable.description !== undefined ? { description: editable.description } : {}),
                        ...(editable.credits !== undefined ? { credits: editable.credits } : {}),
                        ...(editable.semester !== undefined ? { semester: editable.semester || null } : {}),
                        ...(editable.status !== undefined ? { status: editable.status } : {}),
                        updatedAt: new Date(),
                    },
                );

                if (updateResult.count === 0) {
                    throw new ConflictError(
                        'El curso cambió desde que lo abriste. Recarga los datos antes de guardar.',
                    );
                }

                await repository.writeAudit({
                    actorUserId: actingUser.id,
                    courseId,
                    entityId: courseId,
                    action: 'COURSE_UPDATED',
                    changes: Object.fromEntries(
                        Object.entries(editable).filter(([, value]) => value !== undefined),
                    ),
                });

                return repository.getDetail(courseId);
            },
        );
    } catch (error) {
        if ((courseDb as any).isCourseUniqueConstraintError?.(error) || (error as any)?.code === 'P2002') {
            throw new ConflictError('Ya existe un curso con ese nombre o código.');
        }

        throw error;
    }
};

export const remove = async (courseId: string, actingUser: SessionUser) => {
    await ensureCourseScope(actingUser, courseId, true);

    return courseDb.withTransaction(async (repository: any) => {
        const current = await repository.findCourse(courseId);
        if (!current) {
            throw new NotFoundError('El curso solicitado no existe.');
        }

        return repository.removeWithCascade(courseId);
    });
};