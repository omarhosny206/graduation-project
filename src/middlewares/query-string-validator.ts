import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import ApiError from '../utils/api-error';

export function validate(schema: Joi.AnySchema, queryStringName: string) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('HELLO');

      const queryString = req.query[queryStringName] as string;
      console.log('BY');

      let objectToBeValidated: any = {};
      console.log('OBJECT = ', objectToBeValidated);

      objectToBeValidated[queryStringName] = queryString;
      console.log('OBJECT = ', objectToBeValidated);
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
