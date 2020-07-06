import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import UsersController from '../controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/', celebrate({
  [Segments.BODY]: {
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirm_password: Joi.string().required().valid(Joi.ref('password'))
  }
}), usersController.store);

export default usersRouter;
