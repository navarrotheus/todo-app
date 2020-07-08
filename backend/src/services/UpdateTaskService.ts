import { getRepository } from 'typeorm';

import Task from '../models/Task';

import AppError from '../errors/AppError';

interface Request {
  task_id: string;
  user_id: string;
  name: string;
  description: string;
}

export default class UpdateTaskService {
  public async execute ({ task_id, user_id, name, description }: Request): Promise<Task> {
    const tasksRepository = getRepository(Task);

    const task = await tasksRepository.findOne({ where: { id: task_id } });

    if (!task) {
      throw new AppError('Tarefa não existe');
    }

    if (task.user_id !== user_id) {
      throw new AppError('Permissões inválidas', 401);
    }

    const checkTaskNameExists = await tasksRepository.findOne({ where: { name } });

    if (checkTaskNameExists) {
      throw new AppError('Tarefa já existe');
    }

    const updatedTask = await tasksRepository.save({ id: task_id, name, description });

    return updatedTask;
  }
}
