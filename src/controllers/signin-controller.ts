import { NextFunction, Request, Response } from 'express';

import { StatusCode } from '../enums/status-code-enum';
import ISigninRequest from '../interfaces/users/signin-request-interface';
import ISigninResponse from '../interfaces/users/signin-response-interface';
import * as signinService from '../services/signin-service';

export async function signin(
  req: Request<any, any, ISigninRequest>,
  res: Response<ISigninResponse>,
  next: NextFunction
): Promise<Response<ISigninResponse> | void> {
  try {
    const signinRequest: ISigninRequest = req.body;
    const signinResponse: ISigninResponse = await signinService.signin(signinRequest);
    return res.status(StatusCode.Ok).json(signinResponse);
  } catch (error) {
    return next(error);
  }
}
