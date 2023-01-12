import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/api-error';

export async function handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { url } = req;
    return next(ApiError.notFound(`not found: ${url}`));
}
