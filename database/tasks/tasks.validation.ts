import { CreateTaskInput, UpdateTaskInput } from './tasks.model';

export const validateCreateTask = (body: unknown): CreateTaskInput => {
	if (!body || typeof body !== 'object') {
		throw new Error('Cuerpo de la petición inválido.');
	}

	const data = body as Record<string, unknown>;

	if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
		throw new Error('El título de la tarea es obligatorio.');
	}

	if (!data.userId || typeof data.userId !== 'string') {
		throw new Error('El ID de usuario es obligatorio para asociar la tarea.');
	}

	return {
		title: data.title.trim(),
		description: typeof data.description === 'string' ? data.description.trim() : undefined,
		status: typeof data.status === 'string' ? data.status : 'PENDING',
		dueDate: data.dueDate as string | Date | undefined,
		userId: data.userId,
	};
};

export const validateUpdateTask = (body: unknown): UpdateTaskInput => {
	if (!body || typeof body !== 'object') {
		throw new Error('Cuerpo de la petición inválido.');
	}

	const data = body as Record<string, unknown>;
	const updateData: UpdateTaskInput = {};

	if (data.title !== undefined) {
		if (typeof data.title !== 'string' || data.title.trim() === '') {
			throw new Error('El título no puede estar vacío.');
		}
		updateData.title = data.title.trim();
	}

	if (data.description !== undefined) {
		updateData.description = typeof data.description === 'string' ? data.description.trim() : undefined;
	}

	if (data.status !== undefined) {
		if (typeof data.status !== 'string') {
			throw new Error('El estado debe ser un texto válido.');
		}
		updateData.status = data.status;
	}

	if (data.dueDate !== undefined) {
		updateData.dueDate = data.dueDate as string | Date | undefined;
	}

	return updateData;
};