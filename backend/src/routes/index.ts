import { Router } from 'express';

import usersRouter from './users.routes';
import tasksRouter from './tasks.routes';
import sessionsRouter from './sessions.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/tasks', tasksRouter);

export default routes;
