import { NextFunction, Request, RequestHandler, Response } from 'express';

import { StatusCode } from '../enums/status-code-enum';
import IUser from '../interfaces/users/user-interface';
import * as signupService from '../services/signup-service';

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const user: IUser = req.body;
    const savedUser: IUser = await signupService.signup(user);
    return res.status(StatusCode.Created).json(savedUser);
  } catch (error) {
    return next(error);
  }
}

export async function signup2(req: Request, res: Response, next: NextFunction) {
  try {
    const user: IUser = req.body;
    const savedUser: IUser = await signupService.signup2(user);
    return res.status(StatusCode.Created).json(savedUser);
  } catch (error) {
    return next(error);
  }
}

export async function signupByProviders(req: Request, res: Response, next: NextFunction) {
  try {
    const user: IUser = req.body;
    const savedUser: IUser = await signupService.signupByProviders(user);
    return res.status(StatusCode.Created).json(savedUser);
  } catch (error) {
    return next(error);
  }
}