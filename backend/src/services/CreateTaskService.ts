import { getRepository } from 'typeorm';

import Task from '../models/Task';

import AppError from '../errors/AppError';

interface Request {
  user_id: string;
  name: string;
  description?: string;
}

export default class CreateTaskService {
  public async execute ({ user_id, name, description }: Request): Promise<Task> {
    const tasksRepository = getRepository(Task);

    const checkTaskExists = await tasksRepository.findOne({ where: { name } });

    if (checkTaskExists) {
      throw new AppError('Tarefa já existe');
    }

    const task = tasksRepository.create({
      user_id,
      name,
      description
    });

    await tasksRepository.save(task);

    return task;
  }
}
