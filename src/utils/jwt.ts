import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import ApiError from './api-error';

dotenv.config();

const ACCESS_TOKEN_SECRET_KEY: string | undefined = process.env.ACCESS_TOKEN_SECRET_KEY;
const ACCESS_TOKEN_EXPIRATION: string | undefined = process.env.ACCESS_TOKEN_EXPIRATION;
const REFRESH_TOKEN_SECRET_KEY: string | undefined = process.env.REFRESH_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_EXPIRATION: string | undefined = process.env.REFRESH_TOKEN_EXPIRATION;
const EMAIL_CONFIRMATION_TOKEN_SECRET_KEY: string | undefined = process.env.EMAIL_CONFIRMATION_TOKEN_SECRET_KEY;
const EMAIL_CONFIRMATION_TOKEN_EXPIRATION: string | undefined = process.env.EMAIL_CONFIRMATION_TOKEN_EXPIRATION;
const EMAIL_UPDATING_TOKEN_SECRET_KEY: string | undefined = process.env.EMAIL_UPDATING_TOKEN_SECRET_KEY;
const EMAIL_UPDATING_TOKEN_EXPIRATION: string | undefined = process.env.EMAIL_UPDATING_TOKEN_EXPIRATION;
const RESET_PASSWORD_TOKEN_SECRET_KEY: string | undefined = process.env.RESET_PASSWORD_TOKEN_SECRET_KEY;
const RESET_PASSWORD_TOKEN_EXPIRATION: string | undefined = process.env.RESET_PASSWORD_TOKEN_EXPIRATION;
const ZOOM_API_KEY = process.env.ZOOM_API_KEY;
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET;
const ZOOM_TOKEN_EXPIRATION = process.env.ZOOM_TOKEN_EXPIRATION;

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

export async function generateEmailConfirmationToken(email: string): Promise<string> {
  try {
    const signOptions: jwt.SignOptions = { expiresIn: EMAIL_CONFIRMATION_TOKEN_EXPIRATION };
    const token = await jwt.sign({ email: email }, EMAIL_CONFIRMATION_TOKEN_SECRET_KEY!, signOptions);
    return token;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function generateEmailUpdatingToken(email: string): Promise<string> {
  try {
    const signOptions: jwt.SignOptions = { expiresIn: EMAIL_UPDATING_TOKEN_EXPIRATION };
    const token = await jwt.sign({ email: email }, EMAIL_UPDATING_TOKEN_SECRET_KEY!, signOptions);
    return token;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function generateResetPasswordToken(email: string): Promise<string> {
  try {
    const signOptions: jwt.SignOptions = { expiresIn: RESET_PASSWORD_TOKEN_EXPIRATION };
    const token = await jwt.sign({ email: email }, RESET_PASSWORD_TOKEN_SECRET_KEY!, signOptions);
    return token;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function generateVideoMeetingToken(): Promise<string> {
  try {
    const signOptions: jwt.SignOptions = { expiresIn: ZOOM_TOKEN_EXPIRATION };
    const token = await jwt.sign({ iss: ZOOM_API_KEY }, ZOOM_API_SECRET!, signOptions);
    return token;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function verifyAccessToken(accessToken: string): Promise<jwt.JwtPayload> {
  try {
    const payload: jwt.JwtPayload = (await jwt.verify(accessToken, ACCESS_TOKEN_SECRET_KEY!)) as jwt.JwtPayload;
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

export async function verifyEmailConfirmationToken(emailConfirmationToken: string): Promise<jwt.JwtPayload> {
  try {
    const payload: jwt.JwtPayload = (await jwt.verify(
      emailConfirmationToken,
      EMAIL_CONFIRMATION_TOKEN_SECRET_KEY!
    )) as jwt.JwtPayload;
    return payload;
  } catch (error) {
    throw ApiError.unauthorized(error.message);
  }
}

export async function verifyEmailUpdatingToken(emailUpdatingToken: string): Promise<jwt.JwtPayload> {
  try {
    const payload: jwt.JwtPayload = (await jwt.verify(
      emailUpdatingToken,
      EMAIL_UPDATING_TOKEN_SECRET_KEY!
    )) as jwt.JwtPayload;
    return payload;
  } catch (error) {
    throw ApiError.unauthorized(error.message);
  }
}

export async function verifyResetPasswordToken(resetPasswordToken: string): Promise<jwt.JwtPayload> {
  try {
    const payload: jwt.JwtPayload = (await jwt.verify(
      resetPasswordToken,
      RESET_PASSWORD_TOKEN_SECRET_KEY!
    )) as jwt.JwtPayload;
    return payload;
  } catch (error) {
    throw ApiError.unauthorized(error.message);
  }
}
