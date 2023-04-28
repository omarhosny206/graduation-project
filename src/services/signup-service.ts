import bcrypt from 'bcrypt';
import { generateFromEmail } from 'unique-username-generator';

import IUser from '../interfaces/users/user-interface';
import * as emailService from '../services/email-service';
import * as userService from '../services/user-service';
import ApiError from '../utils/api-error';
import * as emailPublisherService from './email-publisher-service';

export async function signup(user: IUser): Promise<IUser> {
  try {
    const { email, password } = user;
    const storedUser = await userService.getByEmailOrDefault(email, null);

    if (storedUser) {
      if (!storedUser.confirmed) {
        emailService.sendEmailConfirmation(email);
        throw ApiError.badRequest('This email is already signed up, check your email for confirmation');
      }

      throw ApiError.badRequest('This email is already taken, choose another one');
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    while (true) {
      user.username = generateFromEmail(user.email, 3);

      const alreadyExistsByUsername = await userService.existsByUsername(user.username);
      if (!alreadyExistsByUsername) {
        break;
      }
    }

    emailService.sendEmailConfirmation(email);
    const savedUser = await userService.save(user);
    return savedUser;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function signup2(user: IUser): Promise<IUser> {
  try {
    const { email, password } = user;
    const storedUser = await userService.getByEmailOrDefault(email, null);

    if (storedUser) {
      if (!storedUser.confirmed) {
        const mailOptions = await emailService.getEmailConfirmationMailOptions(email);
        await emailPublisherService.publish(mailOptions);
        throw ApiError.badRequest('This email is already signed up, check your email for confirmation');
      }

      throw ApiError.badRequest('This email is already taken, choose another one');
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    while (true) {
      user.username = generateFromEmail(user.email, 3);

      const alreadyExistsByUsername = await userService.existsByUsername(user.username);
      if (!alreadyExistsByUsername) {
        break;
      }
    }

    const mailOptions = await emailService.getEmailConfirmationMailOptions(email);
    await emailPublisherService.publish(mailOptions);
    const savedUser = await userService.save(user);
    return savedUser;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function signupByProviders(user: IUser): Promise<IUser> {
  try {
    const { email } = user;
    const storedUser = await userService.getByEmailOrDefault(email, null);

    if (storedUser) {
      throw ApiError.badRequest('This email is already taken, choose another one');
    }

    const password: string = Math.random().toString(36).slice(-8);

    const hashedPassword: string = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    while (true) {
      user.username = generateFromEmail(user.email, 3);

      const alreadyExistsByUsername = await userService.existsByUsername(user.username);
      if (!alreadyExistsByUsername) {
        break;
      }
    }

    user.confirmed = true;
    const savedUser = await userService.save(user);
    return savedUser;
  } catch (error) {
    throw ApiError.from(error);
  }
}
