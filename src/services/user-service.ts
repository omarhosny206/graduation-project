import { Types } from 'mongoose';

import { Role } from '../enums/role-enum';
import ITimeslot from '../interfaces/users/timeslot-interface';
import IUserFilterCriteria from '../interfaces/users/user-filter-criteria-interface';
import IUserInfo from '../interfaces/users/user-info-interface';
import IUser from '../interfaces/users/user-interface';
import UserModel from '../models/user-model';
import * as interviewService from '../services/interview-service';
import ApiError from '../utils/api-error';
import { AuthenticatedUser } from '../utils/authenticated-user-type';
import { hasOverlappingTimeslots } from '../utils/time-slots';

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

export async function filter(filterCriteria: IUserFilterCriteria) {
  try {
    const users = await UserModel.find(filterCriteria);
    return users;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function update(user: AuthenticatedUser, userInfo: IUserInfo) {
  try {
    if (user.info) {
      Object.assign(user.info, userInfo);
    } else {
      user.info = userInfo;
    }

    await user.save();
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function updatePrice(user: AuthenticatedUser, price: number) {
  try {
    if (!user.info) {
      throw ApiError.badRequest('User info is required');
    }

    if (!isIllegibleForPricing(user.username)) {
      throw ApiError.badRequest('Cannot update price, user is not illegible for pricing');
    }

    user.info.price = price;
    const updatedUser = await user.save();
    return updatedUser;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function updateUsername(user: AuthenticatedUser, username: string) {
  try {
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
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function updateRole(user: AuthenticatedUser) {
  try {
    if (user.role === Role.Interviewer) {
      throw ApiError.badRequest('Interviewer cannot update role');
    }

    user.role = Role.Interviewer;
    const updatedUser = await user.save();
    return updatedUser;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getInterviewsHad(username: string) {
  try {
    const interviewsHad = await interviewService.getInterviewsHad(username);
    return interviewsHad;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getById(_id: Types.ObjectId) {
  try {
    const user = await UserModel.findById(_id);
    return user;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getByUserName(username: string) {
  try {
    const user = await UserModel.findOne({ username: username });
    return user;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function save(user: IUser) {
  try {
    const userToBeSaved: IUser = await UserModel.create(user);
    return userToBeSaved;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function deleteById(_id: Types.ObjectId) {
  try {
    await UserModel.findOneAndDelete({ _id: _id });
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function editTimeslots(user: AuthenticatedUser, timeslots: ITimeslot[]) {
  try {
    if (!user.info) {
      throw ApiError.badRequest('user info is required.');
    }

    if (hasOverlappingTimeslots(timeslots)) {
      throw ApiError.badRequest('timeslots has overlapping.');
    }

    user.info.timeslots = timeslots;
    await user.save();
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getInterviewsMade(username: string) {
  try {
    return await interviewService.getInterviewsMade(username);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function isIllegibleForPricing(username: string) {
  try {
    const userId = (await getByUserName(username))?._id;
    const interviewsMade = await getInterviewsMade(username);

    const interviewerRating = interviewsMade
      .filter((interview) => interview.info && interview.info.reviews)
      .map((interview) => {
        for (const review of interview.info?.reviews!) {
          if (review.to.toString() === userId?.toString()) {
            return review.rating;
          }
        }
      });

    if (interviewerRating.length === 0) {
      return false;
    }

    const ratingSum = interviewerRating.reduce((accumulator, currentVal) => {
      return accumulator! + currentVal!;
    }, 0);

    const avgRating = ratingSum! / interviewerRating.length;

    if (avgRating! >= 3) {
      return true;
    }

    return false;
  } catch (error) {
    throw ApiError.from(error);
  }
}
