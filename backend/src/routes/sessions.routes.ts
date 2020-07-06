import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SessionsController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

const sessionValidation = Joi.object({
  username: Joi.string(),
  email: Joi.string(),
  password: Joi.string().required()
}).or('username', 'email');

sessionsRouter.post('/', celebrate({
  [Segments.BODY]: sessionValidation
}), sessionsController.store);

export default sessionsRouter;
