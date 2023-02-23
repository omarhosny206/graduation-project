import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { StatusCode } from '../enums/status-code-enum';
import IUser from '../interfaces/users/user-interface';
import * as userService from '../services/user-service';
import ApiError from '../utils/api-error';
import * as jwt from '../utils/jwt';

export async function regenerateTokens(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken: string = req.body.refreshToken;

    if (!refreshToken) {
      throw ApiError.unauthorized('Unauthorized: refresh token not provided');
    }

    const payload: JwtPayload = await jwt.verifyRefreshToken(refreshToken);
    const user = await userService.getByEmailOrDefault(payload.email, null);

    if (!user) {
      throw ApiError.unauthorized('Unauthorized: user not found');
    }

    const accessToken: string = await jwt.generateAccessToken(payload.email);
    const newRefreshToken: string = await jwt.generateRefreshToken(payload.email);

    return res.status(StatusCode.Ok).json({ accessToken: accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return next(error);
  }
}
