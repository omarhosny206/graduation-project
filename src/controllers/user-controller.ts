import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

import { StatusCode } from '../enums/status-code-enum';
import IPasswordReset from '../interfaces/users/password-reset-interface';
import IPasswordUpdate from '../interfaces/users/password-update-interface';
import ITimeslot from '../interfaces/users/timeslot-interface';
import IUserFilterCriteria from '../interfaces/users/user-filter-criteria-interface';
import IUserInfo from '../interfaces/users/user-info-interface';
import * as userService from '../services/user-service';

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.getAll();
    return res.status(StatusCode.Ok).json(users);
  } catch (error) {
    return next(error);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const user = await userService.getProfile(username);
    return res.status(StatusCode.Ok).json(user);
  } catch (error) {
    return next(error);
  }
}

export async function filter(req: Request, res: Response, next: NextFunction) {
  try {
    const filterCriteria: IUserFilterCriteria = req.body;
    const user = await userService.filter(filterCriteria);
    return res.status(StatusCode.Ok).json(user);
  } catch (error) {
    return next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const userInfo: IUserInfo = req.body;
    const authenticatedUser = req.authenticatedUser;
    const updatedUser = await userService.update(authenticatedUser, userInfo);
    return res.status(StatusCode.Ok).json(updatedUser);
  } catch (error) {
    return next(error);
  }
}

export async function updatePrice(req: Request, res: Response, next: NextFunction) {
  try {
    const price = req.body.price as number;
    const authenticatedUser = req.authenticatedUser;
    const updatedUser = await userService.updatePrice(authenticatedUser, price);
    return res.status(StatusCode.Ok).json(updatedUser);
  } catch (error) {
    return next(error);
  }
}

export async function updateUsername(req: Request, res: Response, next: NextFunction) {
  try {
    const username = req.body.username as string;
    const authenticatedUser = req.authenticatedUser;
    const updatedUser = await userService.updateUsername(authenticatedUser, username);
    return res.status(StatusCode.Ok).json(updatedUser);
  } catch (error) {
    return next(error);
  }
}

export async function updateRole(req: Request, res: Response, next: NextFunction) {
  try {
    const authenticatedUser = req.authenticatedUser;
    const updatedUser = await userService.updateRole(authenticatedUser);
    return res.status(StatusCode.Ok).json(updatedUser);
  } catch (error) {
    return next(error);
  }
}

export async function updatePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const passwordUpdate: IPasswordUpdate = req.body;
    const authenticatedUser = req.authenticatedUser;
    const updatedUser = await userService.updatePassword(passwordUpdate, authenticatedUser);
    return res.status(StatusCode.Ok).json(updatedUser);
  } catch (error) {
    return next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { _id } = req.params;
    const user = await userService.getById(new Types.ObjectId(_id));
    return res.status(StatusCode.Ok).json(user);
  } catch (error) {
    return next(error);
  }
}

export async function deleteById(req: Request, res: Response, next: NextFunction) {
  try {
    const { _id } = req.params;
    await userService.deleteById(new Types.ObjectId(_id));
    return res.status(StatusCode.Ok).json({ message: 'success' });
  } catch (error) {
    return next(error);
  }
}

export async function editTimeslots(req: Request, res: Response, next: NextFunction) {
  try {
    const timeslots = req.body.timeslots as ITimeslot[];
    const authenticatedUser = req.authenticatedUser;
    await userService.editTimeslots(authenticatedUser, timeslots);
    return res.status(StatusCode.Ok).json({ message: 'success' });
  } catch (error) {
    return next(error);
  }
}

export async function confirmEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const { emailConfirmationToken } = req.params;
    await userService.confirmEmail(emailConfirmationToken);
    return res.status(StatusCode.Ok).json({ message: 'Email confirmed successfully, now you can signin!' });
  } catch (error) {
    return next(error);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const email: string = req.body.email;
    await userService.forgotPassword(email);
    return res.status(StatusCode.Ok).json({ message: 'Email sent to reset password' });
  } catch (error) {
    return next(error);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { resetPasswordToken } = req.params;
    const passwordReset: IPasswordReset = req.body;
    const updatedUser = await userService.resetPassword(resetPasswordToken, passwordReset);
    return res.status(StatusCode.Ok).json(updatedUser);
  } catch (error) {
    return next(error);
  }
}

export async function getInterviewsMade(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const interviews = await userService.getInterviewsMade(username);
    return res.status(StatusCode.Ok).json(interviews);
  } catch (error) {
    return next(error);
  }
}

export async function getInterviewsHad(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const interviewsHad = await userService.getInterviewsHad(username);
    return res.status(StatusCode.Ok).json(interviewsHad);
  } catch (error) {
    return next(error);
  }
}

export async function requestEmailUpdate(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    await userService.checkEmailUpdate(email);
    return res.status(StatusCode.Ok).json({ message: 'Email sent to update email' });
  } catch (error) {
    next(error);
  }
}

export async function updateEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const { emailUpdateToken } = req.params;
    const authenticatedUser = req.authenticatedUser;
    const updatedUser = await userService.updateEmail(emailUpdateToken, authenticatedUser);
    return res.status(StatusCode.Ok).json(updatedUser);
  } catch (error) {
    next(error);
  }
}
