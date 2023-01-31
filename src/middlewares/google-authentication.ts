import { Request, Response } from 'express';

import * as jwt from '../utils/jwt';
import { StatusCode } from '../enums/status-code-enum';

export async function handleAuthenticatedUser(req: any, res: any): Promise<any> {
    const isNewUser = !req.user._id;

    if (isNewUser) {
        return res.status(StatusCode.Ok).json({ user: req.user });
    }

    const accessToken: string = await jwt.generateAccessToken(req.user.email);
    const refreshToken: string = await jwt.generateRefreshToken(req.user.email);
    return res.status(StatusCode.Ok).json({ user: req.user, accessToken: accessToken, refreshToken: refreshToken });
}
