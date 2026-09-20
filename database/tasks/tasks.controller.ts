import { TaskModel, CreateTaskInput, UpdateTaskInput } from './tasks.model';
import { validateCreateTask, validateUpdateTask } from './tasks.validation';

export const TaskController = {
	async listTasks(userId?: string) {
		return TaskModel.getAll(userId);
	},

	async getTask(id: string) {
		const task = await TaskModel.getById(id);
		if (!task) {
			throw new Error(`No se encontró la tarea con ID: ${id}`);
		}
		return task;
	},

	async createTask(rawBody: unknown) {
		const validatedData: CreateTaskInput = validateCreateTask(rawBody);
		return TaskModel.create(validatedData);
	},

	async updateTask(id: string, rawBody: unknown) {
		const taskExists = await TaskModel.getById(id);
		if (!taskExists) {
			throw new Error(`No se encontró la tarea con ID: ${id}`);
		}

		const validatedData: UpdateTaskInput = validateUpdateTask(rawBody);
		return TaskModel.update(id, validatedData);
	},

	async deleteTask(id: string) {
		const taskExists = await TaskModel.getById(id);
		if (!taskExists) {
			throw new Error(`No se encontró la tarea con ID: ${id}`);
		}

		return TaskModel.delete(id);
	},
};