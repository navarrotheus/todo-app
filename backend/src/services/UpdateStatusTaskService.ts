import { getRepository } from 'typeorm';

import Task from '../models/Task';

import AppError from '../errors/AppError';

interface Request {
  task_id: string;
  user_id: string;
}

export default class UpdateStatusTaskService {
  public async execute ({ task_id, user_id }: Request): Promise<Task> {
    const tasksRepository = getRepository(Task);

    const task = await tasksRepository.findOne({ where: { id: task_id } });

    if (!task) {
      throw new AppError('Tarefa não existe');
    }

    if (task.user_id !== user_id) {
      throw new AppError('Permissões insuficientes', 401);
    }

    const done_at = task.done_at ? null : new Date().toUTCString();

    const updatedTask = await tasksRepository.save({ id: task_id, done_at });

    return updatedTask;
  }
}
