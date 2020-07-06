import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import TasksController from '../controllers/TasksController';

import authenticateMiddleware from '../middlewares/authenticateMiddleware';

const tasksRouter = Router();
const tasksController = new TasksController();

tasksRouter.use(authenticateMiddleware);

tasksRouter.get('/', tasksController.index);

tasksRouter.post('/', celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    description: Joi.string()
  }
}), tasksController.store);

tasksRouter.delete('/:task_id', celebrate({
  [Segments.PARAMS]: {
    task_id: Joi.string().uuid().required()
  }
}), tasksController.destroy);

const putTaskBodyValidation = Joi.object({
  name: Joi.string(),
  description: Joi.string()
}).or('name', 'description');

tasksRouter.put('/:task_id', celebrate({
  [Segments.PARAMS]: {
    task_id: Joi.string().uuid().required()
  },
  [Segments.BODY]: putTaskBodyValidation
}), tasksController.update);

tasksRouter.patch('/:task_id', celebrate({
  [Segments.PARAMS]: {
    task_id: Joi.string().uuid().required()
  }
}), tasksController.updateStatus);

export default tasksRouter;
