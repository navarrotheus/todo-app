import { Request, Response } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

export default class SessionsController {
  public async store (request: Request, response: Response): Promise<Response> {
    try {
      const { username, email, password } = request.body;

      const authenticateUser = new AuthenticateUserService();

      const { user, token } = await authenticateUser.execute({
        username,
        email,
        password
      });

      delete user.password;

      return response.json({ user, token });
    } catch (err) {
      return response.status(err.statusCode).json({ error: err.message });
    }
  }
}
