import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

import { Role } from '../enums/role-enum';
import * as roleService from '../services/role-service';
import ApiError from '../utils/api-error';

export function authorizeByRole(...allowedRoles: Role[]) {
    return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const _id: Types.ObjectId = req.authenticatedUser._id as Types.ObjectId;
            const user: IUser | null = await userService.getById(_id);

            if (!user) {
                throw ApiError.unauthorized('Unauthorized: user not found');
            }

            const isAuthorized: boolean = roleService.check(user.role, allowedRoles);

            if (!isAuthorized) {
                throw ApiError.forbidden('Unauthorized: your role is not authorized to interact with this resource');
            }

            next();
        } catch (error) {
            return next(error);
        }
    };
}
