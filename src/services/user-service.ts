import bcrypt from 'bcrypt';
import { Types } from 'mongoose';

import { Role } from '../enums/role-enum';
import IInterview from '../interfaces/interviews/interview-interface';
import IFixedUsers from '../interfaces/users/fixed-users-interface';
import IPasswordReset from '../interfaces/users/password-reset-interface';
import IPasswordUpdate from '../interfaces/users/password-update-interface';
import ISigninResponse from '../interfaces/users/signin-response-interface';
import ITimeslot from '../interfaces/users/timeslot-interface';
import IUserInfo from '../interfaces/users/user-info-interface';
import IUser from '../interfaces/users/user-interface';
import UserModel from '../models/user-model';
import * as emailService from '../services/email-service';
import * as interviewService from '../services/interview-service';
import ApiError from '../utils/api-error';
import { AuthenticatedUser } from '../utils/authenticated-user-type';
import * as jwt from '../utils/jwt';
import { hasOverlappingTimeslots } from '../utils/time-slots';
import * as emailPublisherService from './email-publisher-service';

export async function getAll() {
  try {
    const users = await UserModel.find();
    return users;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getAllFixed() {
  try {
    let results = await Promise.all([
      UserModel.find({ role: Role.Interviewer, 'info.priceable': false }),
      UserModel.find({ role: Role.Interviewer, 'info.priceable': true }),
      UserModel.find({ role: Role.Interviewer, 'info.skills': { $in: ['DSA'] } }),
      UserModel.find({ role: Role.Interviewer, 'info.skills': { $in: ['System Design'] } }),
    ]);

    const newResults = await Promise.all(
      results.map(async (result) => {
        let newResult = (
          await Promise.all(
            result.map(async (user) => {
              const interviewsMadeWithReviews = await interviewService.getInterviewsMadeWithReviews(user);
              const rating = await getRatingForInterviewer(user, interviewsMadeWithReviews);
              return { ...user.toObject(), rating: rating };
            })
          )
        ).sort((a, b) => b.rating - a.rating);

        if (newResult.length > 5) {
          newResult = newResult.slice(0, 5);
        }
        return newResult;
      })
    );

    const [free, priceable, dsa, systemDesign] = newResults;

    const fixedUsers: IFixedUsers = {
      free: free,
      priceable: priceable,
      dsa: dsa,
      systemDesign: systemDesign,
    };

    return fixedUsers;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getByEmail(email: string) {
  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      throw ApiError.badRequest('user not found with this email');
    }

    return user;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getProfile(username: string) {
  try {
    const user = await getByUserName(username);
    let interviewsWithReviews = null;
    let rating = null;

    if (user.role === Role.Interviewer) {
      interviewsWithReviews = await interviewService.getInterviewsMadeWithReviews(user);
      rating = await getRatingForInterviewer(user, interviewsWithReviews);
    } else {
      interviewsWithReviews = await interviewService.getInterviewsHadWithReviews(user);
      rating = await getRatingForInterviewee(user, interviewsWithReviews);
    }

    return { ...user.toObject(), rating: rating };
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function search(searchCriteria: any) {
  try {
    let filters: any[] = [];

    if (searchCriteria['info.skills']) {
      const queries = searchCriteria['info.skills']
        .split(',')
        .map((value: string) => value.trim())
        .filter((value: string) => value.length);

      const multipleValuesFilters = queries.map((value: string) => ({
        text: {
          query: value,
          path: 'info.skills',
          fuzzy: {},
        },
      }));

      filters = [...multipleValuesFilters];
    }

    if (searchCriteria['fullTextSearch']) {
      const query = searchCriteria['fullTextSearch'];

      const fullTextSearchFilter = {
        text: {
          query: query,
          path: ['info.firstName', 'info.lastName', 'info.bio'],
          fuzzy: {},
        },
      };

      filters.push(fullTextSearchFilter);
    }

    let users = await UserModel.aggregate([
      {
        $search: {
          index: 'users_search_index',
          compound: {
            must: filters,
          },
        },
      },
      {
        $project: {
          score: { $meta: 'searchScore' },
          document: '$$ROOT',
        },
      },
    ]).sort({ score: -1, 'document.info.price': 1 });

    users = users.filter((user) => user.document.role === Role.Interviewer);

    users = await Promise.all(
      users
        .map((user) => ({ _id: user._id, score: user.score, ...user.document }))
        .map(async (user) => {
          const interviewsMadeWithReviews = await interviewService.getInterviewsMadeWithReviews(user);
          const rating = await getRatingForInterviewer(user, interviewsMadeWithReviews);
          return { ...user, rating: rating };
        })
    );

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

    const updatedUser = await user.save();
    return updatedUser;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function updateSkills(user: AuthenticatedUser, skills: string[]) {
  try {
    if (!user.info) {
      throw ApiError.badRequest('User info is required');
    }

    user.info.skills = skills;
    const updatedUser = await user.save();
    return updatedUser;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function updatePrice(user: AuthenticatedUser, price: number) {
  try {
    if (!user.info) {
      throw ApiError.badRequest('User info is required');
    }

    if (!user.info.priceable && !(await isIllegibleForPricing(user))) {
      throw ApiError.badRequest('Cannot update price, user is not illegible for pricing');
    }

    user.info.price = price;
    user.info.priceable = true;
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

    const alreadyExistsByUsername = await existsByUsername(username);
    if (alreadyExistsByUsername) {
      throw ApiError.badRequest('username is already used');
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

export async function confirmEmail(emailConfirmationToken: string) {
  try {
    const payload = await jwt.verifyEmailConfirmationToken(emailConfirmationToken);
    const user = await getByEmail(payload.email);
    user.confirmed = true;
    await user.save();
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function updatePassword(passwordUpdate: IPasswordUpdate, user: AuthenticatedUser) {
  try {
    const isOldPasswordCorrect = await bcrypt.compare(passwordUpdate.oldPassword, user.password);

    if (!isOldPasswordCorrect) {
      throw ApiError.badRequest('Old password is incorrect');
    }

    if (passwordUpdate.newPassword !== passwordUpdate.confirmPassword) {
      throw ApiError.badRequest('New password & Confirm password should be equal');
    }

    user.password = await bcrypt.hash(passwordUpdate.newPassword, 10);

    const updatedUser = await user.save();
    return updatedUser;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function forgotPassword(email: string) {
  try {
    const user = await getByEmail(email);
    emailService.sendResetPassword(email);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function forgotPassword2(email: string) {
  try {
    const user = await getByEmail(email);
    const mailOptions = await emailService.getResetPasswordMailOptions(email);
    await emailPublisherService.publish(mailOptions);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function resetPassword(resetPasswordToken: string, passwordReset: IPasswordReset) {
  try {
    const payload = await jwt.verifyResetPasswordToken(resetPasswordToken);
    const user = await getByEmail(payload.email);

    if (passwordReset.newPassword !== passwordReset.confirmPassword) {
      throw ApiError.badRequest('New password & Confirm password should be equal');
    }

    user.password = await bcrypt.hash(passwordReset.newPassword, 10);

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

export async function getInterviewsHadGroupedByStatus(user: AuthenticatedUser) {
  try {
    const groupedInterviewsHad = await interviewService.getInterviewsHadGroupedByStatus(user.username);
    return groupedInterviewsHad;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getById(_id: Types.ObjectId) {
  try {
    const user = await UserModel.findById(_id);

    if (!user) {
      throw ApiError.badRequest('user not found with this id');
    }

    return user;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getByUserName(username: string) {
  try {
    const user = await UserModel.findOne({ username: username });

    if (!user) {
      throw ApiError.badRequest('user not found with this username');
    }

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

export async function getInterviewsMadeGroupedByStatus(user: AuthenticatedUser) {
  try {
    const groupedInterviewsMade = await interviewService.getInterviewsMadeGroupedByStatus(user.username);
    return groupedInterviewsMade;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function isIllegibleForPricing(user: AuthenticatedUser) {
  try {
    if (user.info?.priceable) {
      return true;
    }

    const interviewsMadeWithReviews = await interviewService.getInterviewsMadeWithReviews(user);

    if (interviewsMadeWithReviews.length < 3) {
      throw ApiError.badRequest('Not illegible, you must have at least 3 finished interviews with ratings');
    }

    const rating: number = await getRatingForInterviewer(user, interviewsMadeWithReviews);
    console.log('rating=', rating);

    if (rating < 3) {
      return false;
    }

    return true;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getRatingForInterviewer(user: IUser, interviewsMadeWithReviews: IInterview[]) {
  try {
    const interviewerRatings = interviewsMadeWithReviews.map((interview) => {
      for (const review of interview.info?.reviews!) {
        if (user._id.equals(review.to)) {
          return review.rating;
        }
      }
    });

    const ratingsSum = interviewerRatings.reduce((accumulator, currentVal) => {
      return accumulator! + currentVal!;
    }, 0);

    if (ratingsSum === 0) {
      return 0;
    }

    const avgRating = ratingsSum! / interviewerRatings.length;
    return avgRating;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getRatingForInterviewee(user: IUser, interviewsHadWithReviews: IInterview[]) {
  try {
    const intervieweeRatings = interviewsHadWithReviews.map((interview) => {
      for (const review of interview.info?.reviews!) {
        if (user._id.equals(review.to)) {
          return review.rating;
        }
      }
    });

    const ratingsSum = intervieweeRatings.reduce((accumulator, currentVal) => {
      return accumulator! + currentVal!;
    }, 0);

    if (ratingsSum === 0) {
      return 0;
    }

    const avgRating = ratingsSum! / intervieweeRatings.length;
    return avgRating;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function checkEmailUpdate(email: string) {
  try {
    const user = await UserModel.findOne({ email: email });
    console.log(user);
    if (user) {
      throw ApiError.badRequest('This email is already taken.');
    }
    emailService.sendEmailUpdate(email);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function checkEmailUpdate2(email: string) {
  try {
    const user = await UserModel.findOne({ email: email });

    if (user) {
      throw ApiError.badRequest('This email is already taken.');
    }

    const mailOptions = await emailService.getEmailUpdateMailOptions(email);
    await emailPublisherService.publish(mailOptions);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function updateEmail(emailUpdateToken: string, user: AuthenticatedUser) {
  try {
    const { email } = await jwt.verifyEmailUpdatingToken(emailUpdateToken);
    user.email = email;
    const updatedUser = await user.save();
    const accessToken = await jwt.generateAccessToken(updatedUser.email);
    const refreshToken = await jwt.generateRefreshToken(updatedUser.email);
    const signinResponse: ISigninResponse = { user: updatedUser, accessToken: accessToken, refreshToken: refreshToken };
    return signinResponse;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getByEmailOrDefault(email: string, defaultValue: null = null) {
  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return defaultValue;
    }

    return user;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function existsByUsername(username: string) {
  try {
    const user = await UserModel.findOne({ username: username });

    if (!user) {
      return false;
    }

    return true;
  } catch (error) {
    throw ApiError.from(error);
  }
}
