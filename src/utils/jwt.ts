import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import ApiError from './api-error';

dotenv.config();

const ACCESS_TOKEN_SECRET_KEY: string | undefined = process.env.ACCESS_TOKEN_SECRET_KEY;
const ACCESS_TOKEN_EXPIRATION: string | undefined = process.env.ACCESS_TOKEN_EXPIRATION;
const REFRESH_TOKEN_SECRET_KEY: string | undefined = process.env.REFRESH_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_EXPIRATION: string | undefined = process.env.REFRESH_TOKEN_EXPIRATION;

export async function generateAccessToken(email: string): Promise<string> {
  try {
    const signOptions: jwt.SignOptions = { expiresIn: ACCESS_TOKEN_EXPIRATION };
    const token = await jwt.sign({ email: email }, ACCESS_TOKEN_SECRET_KEY!, signOptions);
    return token;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function generateRefreshToken(email: string): Promise<string> {
  try {
    const signOptions: jwt.SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRATION };
    const token = await jwt.sign({ email: email }, REFRESH_TOKEN_SECRET_KEY!, signOptions);
    return token;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function verifyAccessToken(acessToken: string): Promise<jwt.JwtPayload> {
  try {
    const payload: jwt.JwtPayload = (await jwt.verify(acessToken, ACCESS_TOKEN_SECRET_KEY!)) as jwt.JwtPayload;
    return payload;
  } catch (error) {
    throw ApiError.unauthorized(error.message);
  }
}

export async function verifyRefreshToken(refreshToken: string): Promise<jwt.JwtPayload> {
  try {
    const payload: jwt.JwtPayload = (await jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY!)) as jwt.JwtPayload;
    return payload;
  } catch (error) {
    throw ApiError.unauthorized(error.message);
  }
}
