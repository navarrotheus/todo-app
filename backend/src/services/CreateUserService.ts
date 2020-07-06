import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  username: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  public async execute ({ username, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkEmailExists = await usersRepository.findOne({
      where: { email }
    });

    if (checkEmailExists) {
      throw new AppError('Email já está em uso');
    }

    const checkUsernameExists = await usersRepository.findOne({
      where: { username }
    });

    if (checkUsernameExists) {
      throw new AppError('Username já está em uso');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      username,
      email,
      password: hashedPassword
    });

    await usersRepository.save(user);

    return user;
  }
}
