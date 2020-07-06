import { Request, Response } from 'express';

import CreateUserService from '../services/CreateUserService';

export default class UsersController {
  public async store (request: Request, response: Response): Promise<Response> {
    try {
      const { username, email, password } = request.body;

      const createUser = new CreateUserService();

      const user = await createUser.execute({
        username,
        email,
        password
      });

      delete user.password;

      return response.json(user);
    } catch (err) {
      return response.status(err.statusCode).json({ error: err.message });
    }
  }
}
