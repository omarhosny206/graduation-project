import IUser from '../interfaces/users/user-interface';
import axios from 'axios';
import * as dotenv from 'dotenv';

import { StatusCode } from '../enums/status-code-enum';
import * as userService from '../services/user-service';
import ApiError from '../utils/api-error';
import * as jwt from '../utils/jwt';

dotenv.config();

const GOOGLE_OAUTH2_URL: string | undefined = process.env.GOOGLE_OAUTH2_URL;

export async function authenticateByAccessToken(req: any, res: any, next: any): Promise<any> {
  try {
    const { googleAccessToken } = req.body;

    if (!googleAccessToken) {
      throw ApiError.unauthorized('Unauthorized (google): google access token not provided');
    }

    const { data } = await axios.get(GOOGLE_OAUTH2_URL!, {
      headers: { Authorization: `Bearer ${googleAccessToken}` },
    });
    const firstName: string = data.given_name;
    const lastName: string = data.family_name;
    const email: string = data.email;

    const user = await userService.getByEmailOrDefault(email, null);

    if (!user) {
      return res.status(StatusCode.Ok).json({ firstName: firstName, lastName: lastName, email: email });
    }

    const accessToken: string = await jwt.generateAccessToken(user.email);
    const refreshToken: string = await jwt.generateRefreshToken(user.email);
    return res.status(StatusCode.Ok).json({ user: user, accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    return next(error);
  }
}
