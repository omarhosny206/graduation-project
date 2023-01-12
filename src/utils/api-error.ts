import { StatusCode } from '../enums/status-code-enum';
import ResponseError from './response-error';

export default class ApiError extends Error {
    static badRequest(message: string = 'Invalid request'): ResponseError {
        return new ResponseError(message, StatusCode.BadRequest);
    }

    static internalServerError(message: string = 'Internal server error'): ResponseError {
        return new ResponseError(message, StatusCode.InternalServerError);
    }

    static unauthorized(message: string = 'Your not authorized to do this action'): ResponseError {
        return new ResponseError(message, StatusCode.Unauthorized);
    }

    static forbidden(message: string = 'You do not have priviliges to perform this action'): ResponseError {
        return new ResponseError(message, StatusCode.Forbidden);
    }

    static notFound(message: string = 'URL not found'): ResponseError {
        return new ResponseError(message, StatusCode.NotFound);
    }

    static from(error: Error): ResponseError {
        const newError: ResponseError = error as ResponseError;
        newError.status = newError.status || StatusCode.InternalServerError;
        return newError;
    }
}
