import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import ApiError from '../utils/api-error';

export function validate(schema: Joi.AnySchema, queryStringName: string) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const queryString = req.query[queryStringName] as string;

      let objectToBeValidated: any = {};
      objectToBeValidated[queryStringName] = queryString;
      
      const value = await schema.validateAsync(objectToBeValidated, { abortEarly: false });
      next();
    } catch (error) {
      const messages: string = error.details
        .map((validationErrorItem: Joi.ValidationErrorItem) => validationErrorItem.message)
        .toString();
      next(ApiError.badRequest(messages));
    }
  };
}
