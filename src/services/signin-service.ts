import bcrypt from 'bcrypt';

import ISigninRequest from '../interfaces/users/signin-request-interface';
import ISigninResponse from '../interfaces/users/signin-response-interface';
import * as userService from '../services/user-service';
import ApiError from '../utils/api-error';
import * as jwt from '../utils/jwt';

export async function signin(loginRequest: ISigninRequest): Promise<ISigninResponse> {
  try {
    const { email, password } = loginRequest;
    let storedUser = await userService.getByEmail(email);

    if (!storedUser) {
      throw ApiError.unauthorized('Bad Credentials: Invalid email');
    }

    const hashedPassword = storedUser.password;
    const areEqualPasswords = await bcrypt.compare(password, hashedPassword);

    if (!areEqualPasswords) {
      throw ApiError.unauthorized('Bad Credentials: Invalid password');
    }

    if (!storedUser.confirmed) {
      throw ApiError.unauthorized('Email confirmation is required');
    }

    if (!storedUser.active) {
      storedUser.active = true;
      storedUser = await storedUser.save();
    }

    const accessToken = await jwt.generateAccessToken(email);
    const refreshToken = await jwt.generateRefreshToken(email);
    return { user: storedUser, accessToken: accessToken, refreshToken: refreshToken };
  } catch (error) {
    throw ApiError.from(error);
  }
}
