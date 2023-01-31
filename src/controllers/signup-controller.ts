import { NextFunction, Request, RequestHandler, Response } from "express";

import IUser from "../interfaces/user-interface";
import * as signupService from "../services/signup-service";

export const signup: RequestHandler = async (
    req: Request<any, any, IUser>,
    res: Response<IUser>,
    next: NextFunction
): Promise<Response<IUser> | void> => {
    try {
        const user: IUser = req.body;
        const savedUser: IUser = await signupService.signup(user);
        return res.status(201).json(savedUser);
    } catch (error) {
        return next(error);
    }
};

export const signupByGoogle: RequestHandler = async (
    req: Request<any, any, IUser>,
    res: Response<IUser>,
    next: NextFunction
): Promise<Response<IUser> | void> => {
    try {
        const user: IUser = req.body;
        const savedUser: IUser = await signupService.signupByGoogle(user);
        return res.status(201).json(savedUser);
    } catch (error) {
        return next(error);
    }
};