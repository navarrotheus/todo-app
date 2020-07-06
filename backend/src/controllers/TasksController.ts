import { Request, Response } from 'express';

import CreateTaskService from '../services/CreateTaskService';
import DeleteTaskService from '../services/DeleteTaskService';
import UpdateTaskService from '../services/UpdateTaskService';
import UpdateStatusTaskService from '../services/UpdateStatusTaskService';

import { getRepository } from 'typeorm';
import Task from '../models/Task';

export default class TasksController {
  public async store (request: Request, response: Response): Promise<Response> {
    try {
      const { name, description } = request.body;

      const user_id = request.user.id;

      const createTask = new CreateTaskService();

      const task = await createTask.execute({
        user_id,
        name,
        description
      });

      return response.json(task);
    } catch (err) {
      return response.status(err.statusCode).json({ error: err.message });
    }
  }

  public async index (request: Request, response: Response): Promise<Response> {
    try {
      const user_id = request.user.id;

      const tasksRepository = getRepository(Task);

      const tasks = await tasksRepository.find({ where: { user_id } });

      return response.json(tasks);
    } catch (err) {
      return response.status(err.statusCode).json({ error: err.message });
    }
  }

  public async destroy (request: Request, response: Response): Promise<Response> {
    try {
      const user_id = request.user.id;
      const { task_id } = request.params;

      const deleteTask = new DeleteTaskService();

      await deleteTask.execute({ task_id, user_id });

      return response.status(204).send();
    } catch (err) {
      return response.status(err.statusCode).json({ error: err.message });
    }
  }

  public async update (request: Request, response: Response): Promise<Response> {
    try {
      const user_id = request.user.id;
      const { task_id } = request.params;

      const { name, description } = request.body;

      const updateTask = new UpdateTaskService();

      const updatedTask = await updateTask.execute({ task_id, user_id, name, description });

      return response.json(updatedTask);
    } catch (err) {
      return response.status(err.statusCode).json({ error: err.message });
    }
  }

  public async updateStatus (request: Request, response: Response): Promise<Response> {
    try {
      const user_id = request.user.id;
      const { task_id } = request.params;

      const updateTask = new UpdateStatusTaskService();

      const updatedTask = await updateTask.execute({ task_id, user_id });

      return response.json(updatedTask);
    } catch (err) {
      return response.status(err.statusCode).json({ error: err.message });
    }
  }
}
