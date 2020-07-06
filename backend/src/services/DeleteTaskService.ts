import { getRepository } from 'typeorm';

import Task from '../models/Task';

import AppError from '../errors/AppError';

interface Request {
  task_id: string;
  user_id: string;
}

export default class DeleteTaskService {
  public async execute ({ task_id, user_id }: Request): Promise<void> {
    const tasksRepository = getRepository(Task);

    const task = await tasksRepository.findOne({ where: { id: task_id } });

    if (!task) {
      throw new AppError('Tarefa não existe');
    }

    if (task.user_id !== user_id) {
      throw new AppError('Permissões insuficientes', 401);
    }

    tasksRepository.delete(task_id);
  }
}
