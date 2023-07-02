import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import ApiError from '../utils/api-error';

export function validate(schema: Joi.AnySchema, paramName: string) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const param = req.params[paramName];
      let objectToBeValidated: any = {};
      objectToBeValidated[paramName] = param;
      console.log(schema);
      console.log("OBJECT=", objectToBeValidated);
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
