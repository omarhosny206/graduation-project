import { Types } from 'mongoose';

import { Role } from '../enums/role-enum';
import ITimeslot from '../interfaces/users/timeslot-interface';
import IUserFilterCriteria from '../interfaces/users/user-filter-criteria-interface';
import IUserInfo from '../interfaces/users/user-info-interface';
import IUser from '../interfaces/users/user-interface';
import UserInfoModel from '../models/user-info-model';
import UserModel from '../models/user-model';
import * as interviewService from '../services/interview-service';
import ApiError from '../utils/api-error';
import { getNumberFormat, hasOverlappingInDifferentDays, hasOverlappingInSameDay } from '../utils/time-slots';

export async function getAll() {
  try {
    const users = await UserModel.find();
    return users;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getByEmail(email: string) {
  try {
    const user = await UserModel.findOne({ email: email });
    return user;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getProfile(username: string) {
  try {
    const user = await (await getByUserName(username))?.populate('info');

    if (!user) {
      throw ApiError.badRequest('user not found');
    }

    return user;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getInfo(_id: Types.ObjectId) {
  try {
    const user = await (await getById(_id))?.populate('info');

    if (!user) {
      throw ApiError.badRequest('user not found');
    }

    return user.info;
  } catch (error) {
    throw ApiError.from(error);
  }
}

// NOT IMPLEMENTED CORRECTLY
export async function filter(filterCriteria: IUserFilterCriteria) {
  try {
    const users = await UserModel.find(filterCriteria);
    return users;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function update(_id: Types.ObjectId, userInfo: IUserInfo) {
  try {
    const savedUser = await getById(_id);

    if (!savedUser) {
      throw ApiError.badRequest('Cannot update, user not found');
    }

    if (savedUser.info) {
      await UserInfoModel.updateOne({ _id: savedUser.info._id }, userInfo);
      return;
    }

    const savedUserInfo = await UserInfoModel.create(userInfo);
    savedUser.info = savedUserInfo;
    await savedUser.save();
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function updatePrice(_id: Types.ObjectId, price: number) {
  const user = await getById(_id);

  if (!user) {
    throw ApiError.badRequest('Cannot update price, user not found');
  }

  if (!user.info) {
    throw ApiError.badRequest('User info is required');
  }

  if (user.role === Role.Interviewee) {
    throw ApiError.badRequest('Interviewee cannot update price');
  }

  const userInfo = await UserInfoModel.findById(user.info);

  if (!userInfo) {
    throw ApiError.badRequest('User info is required');
  }

  if (!isIllegibleForPricing(userInfo!)) {
    throw ApiError.badRequest('Cannot update price, user is not illegible for pricing');
  }

  userInfo.price = price;
  const updatedUserInfo = await userInfo.save();
  return updatedUserInfo;
}

export async function updateUsername(_id: Types.ObjectId, username: string) {
  const user = await getById(_id);

  if (!user) {
    throw ApiError.badRequest('Cannot update username, user not found');
  }

  if (user.username === username) {
    return user;
  }

  const userWithUsername = await getByUserName(username);

  if (userWithUsername) {
    throw ApiError.badRequest('Cannot update username, it is already used');
  }

  user.username = username;
  const updatedUser = await user.save();
  return updatedUser;
}

export async function updateRole(_id: Types.ObjectId) {
  const user = await getById(_id);

  if (!user) {
    throw ApiError.badRequest('Cannot update username, user not found');
  }

  if (user.role === Role.Interviewer) {
    throw ApiError.badRequest('Interviewer cannot update role');
  }

  user.role = Role.Interviewer;
  const updatedUser = await user.save();
  return updatedUser;
}

export async function getInterviewsHad(username: string) {
  const interviewsHad = await interviewService.getInterviewsHad(username);
  return interviewsHad;
}

export async function hasOverlappingTimeslots(_id: Types.ObjectId, timeslots: ITimeslot[]) {
  const savedUserInfo = await getInfo(_id);

  if (!savedUserInfo) {
    throw ApiError.badRequest('user info is required');
  }

  const numberFormat = getNumberFormat(timeslots);

  if (hasOverlappingInSameDay(numberFormat) || hasOverlappingInDifferentDays(numberFormat)) {
    return true;
  }

  return false;
}

// ........................................................................................... //
//  DELETE  //
// ........................................................................................... //

// delete
export async function getById(_id: Types.ObjectId) {
  try {
    const user = await UserModel.findById(_id);
    return user;
  } catch (error) {
    throw ApiError.from(error);
  }
}

// delete
export async function getByUserName(username: string) {
  try {
    const user = await UserModel.findOne({ username: username });
    return user;
  } catch (error) {
    throw ApiError.from(error);
  }
}

// delete
export async function save(user: IUser) {
  try {
    const savedUser: IUser = await UserModel.create(user);
    return savedUser;
  } catch (error) {
    throw ApiError.from(error);
  }
}

// delete
export async function getInterviewsMade(username: string) {
  const interviewsMade = await interviewService.getInterviewsMade(username);
  return interviewsMade;
}

// delete
export async function isIllegibleForPricing(userInfo: IUserInfo) {
  return true;
}
