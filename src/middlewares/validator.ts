import ILoginRequest from '../interfaces/login-request-interface';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import ApiError from '../utils/api-error';

export function validate(schema: Joi.AnySchema) {
    return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const body = req.body;
            const value = await schema.validateAsync(body, { abortEarly: false });
            next();
        } catch (error) {
            const messages: string = error.details
                .map((validationErrorItem: Joi.ValidationErrorItem) => validationErrorItem.message)
                .toString();
            next(ApiError.badRequest(messages));
        }
    };
}
