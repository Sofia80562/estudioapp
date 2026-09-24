import { taskDb } from '@/database/tasks';
import { AuthorizationError, ConflictError, NotFoundError } from '@/errors';
import type { SessionUser } from '@/lib/session';
import type {
    CreateTaskBody,
    TaskQueryParams,
    UpdateTaskBody,
} from '@/validations/tasks';

export const getAll = async (filtersOrUserId: any, actingUserOrFilters?: any, pagination?: any) => {
    // Se detecta si el primer argumento es un string (userId) o el objeto de filtros
    let filters = typeof filtersOrUserId === 'object' ? filtersOrUserId : {};
    let actingUser = typeof filtersOrUserId === 'string' ? actingUserOrFilters : actingUserOrFilters;
    
    // Si se pasan separados (filters, actingUser, pagination) o (userId, filters, pagination)
    const userId = typeof filtersOrUserId === 'string' ? filtersOrUserId : actingUser?.id;

    const combinedFilters = { ...filters, ...(pagination || {}) };
    return taskDb.getAll(combinedFilters, { userId: userId || actingUserOrFilters?.id });
};

export const getById = async (taskId: string, actingUser: SessionUser) => {
    const task = await taskDb.getUnique(taskId);
    if (!task) {
        throw new NotFoundError('La tarea solicitada no existe.');
    }
    return task;
};

export const create = async (data: CreateTaskBody, actingUser: SessionUser) => {
    return taskDb.withTransaction(async (repository: any) => {
        return repository.createTask({
            ...data,
            userId: actingUser.id,
        });
    });
};

export const update = async (taskId: string, data: UpdateTaskBody, actingUser: SessionUser) => {
    return taskDb.withTransaction(async (repository: any) => {
        const current = await repository.findTask(taskId);
        if (!current) {
            throw new NotFoundError('La tarea solicitada no existe.');
        }

        const { expectedUpdatedAt, ...editable } = data;
        const result = await repository.updateTask(taskId, new Date(expectedUpdatedAt), editable);

        if (result.count === 0) {
            throw new ConflictError('La tarea cambió desde que la abriste. Recarga los datos.');
        }

        return repository.getDetail(taskId);
    });
};

export const remove = async (taskId: string, actingUser: SessionUser) => {
    return taskDb.withTransaction(async (repository: any) => {
        const current = await repository.findTask(taskId);
        if (!current) {
            throw new NotFoundError('La tarea solicitada no existe.');
        }
        return repository.removeWithCascade(taskId);
    });
};

// Aliases requeridos por las rutas de API
export const listOwnTasks = getAll;
export const createTask = create;
export const deleteOwnTask = remove;