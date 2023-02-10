import bcrypt from 'bcrypt';
import { generateFromEmail } from 'unique-username-generator';

import IUser from '../interfaces/users/user-interface';
import * as userService from '../services/user-service';
import ApiError from '../utils/api-error';

export async function signup(user: IUser): Promise<IUser> {
  try {
    const { email, password } = user;
    const storedUser = await userService.getByEmail(email);

    if (storedUser) {
      throw ApiError.badRequest('This email is already taken, choose another one');
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    while (true) {
      user.username = generateFromEmail(user.email, 3);
      console.log(user.username);

      const userWithSameUsername = await userService.getByUserName(user.username);
      if (!userWithSameUsername) {
        break;
      }
    }

    const savedUser = await userService.save(user);

    return savedUser;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function signupByProviders(user: IUser): Promise<IUser> {
  try {
    const { email } = user;
    const storedUser = await userService.getByEmail(email);

    if (storedUser) {
      throw ApiError.badRequest('This email is already taken, choose another one');
    }

    const password: string = Math.random().toString(36).slice(-8);

    const hashedPassword: string = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    while (true) {
      user.username = generateFromEmail(user.email, 3);
      console.log(user.username);

      const userWithSameUsername = await userService.getByUserName(user.username);
      if (!userWithSameUsername) {
        break;
      }
    }

    const savedUser = await userService.save(user);

    return savedUser;
  } catch (error) {
    throw ApiError.from(error);
  }
}
