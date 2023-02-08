import IUser from '../interfaces/users/user-interface';
import { NextFunction, Request, RequestHandler, Response } from 'express';

import * as signupService from '../services/signup-service';

export async function signup(
    req: Request<any, any, IUser>,
    res: Response<IUser>,
    next: NextFunction
): Promise<Response<IUser> | void> {
    try {
        const user: IUser = req.body;
        const savedUser: IUser = await signupService.signup(user);
        return res.status(201).json(savedUser);
    } catch (error) {
        return next(error);
    }
}

export async function signupByProviders(
    req: Request<any, any, IUser>,
    res: Response<IUser>,
    next: NextFunction
): Promise<Response<IUser> | void> {
    try {
        const user: IUser = req.body;
        const savedUser: IUser = await signupService.signupByProviders(user);
        return res.status(201).json(savedUser);
    } catch (error) {
        return next(error);
    }
}
