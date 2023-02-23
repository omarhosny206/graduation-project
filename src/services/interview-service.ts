import { Types } from 'mongoose';

import { InterviewStatus } from '../enums/interview-status-enum';
import { Role } from '../enums/role-enum';
import IInterviewFilterCriteria from '../interfaces/interviews/interview-filter-criteria-interface';
import IInterviewInfo from '../interfaces/interviews/interview-info-interface';
import IInterview from '../interfaces/interviews/interview-interface';
import IReview from '../interfaces/interviews/review-interface';
import InterviewModel from '../models/interview-model';
import * as userService from '../services/user-service';
import ApiError from '../utils/api-error';
import { AuthenticatedUser } from '../utils/authenticated-user-type';

export async function getAll() {
  try {
    const interviews = await InterviewModel.find();
    return interviews;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getInterviewsHad(username: string) {
  try {
    const user = await userService.getByUserName(username);
    const interviewsHad = await InterviewModel.find({ interviewee: user._id });
    return interviewsHad;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getInterviewsMade(username: string) {
  try {
    const user = await userService.getByUserName(username);
    if (user.role === Role.Interviewee) {
      throw ApiError.badRequest('Cannot get interviews made, interviewee role is not allowed to make interviews');
    }
    const interviewsHad = await InterviewModel.find({ interviewer: user._id });
    return interviewsHad;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getById(_id: Types.ObjectId) {
  try {
    const interview = await InterviewModel.findById(_id);

    if (!interview) {
      throw ApiError.badRequest('interview not found with this id');
    }

    return interview;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function filter(filterCriteria: IInterviewFilterCriteria) {
  try {
    const interviews = await InterviewModel.find(filterCriteria);
    return interviews;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function update(_id: Types.ObjectId, user: AuthenticatedUser, interviewInfo: IInterviewInfo) {
  try {
    const interview = await getById(_id);

    if (!user._id.equals(interview.interviewer) && !user._id.equals(interview.interviewee)) {
      throw ApiError.badRequest('Cannot update info, you are not a member in this interview');
    }

    if (!interview.isFinished || interview.status !== InterviewStatus.Finished) {
      throw ApiError.badRequest('Cannot update info, interview not finished yet');
    }

    if (interview.info) {
      Object.assign(interview.info, interviewInfo);
    } else {
      interview.info = interviewInfo;
    }

    const updatedInterview = await interview.save();
    return updatedInterview;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function updateReview(_id: Types.ObjectId, user: AuthenticatedUser, review: IReview) {
  try {
    const interview = await getById(_id);

    if (!user._id.equals(review.from)) {
      throw ApiError.badRequest('Cannot update reviews, you are not the author of this review');
    }

    if (!user._id.equals(interview.interviewer) && !user._id.equals(interview.interviewee)) {
      throw ApiError.badRequest('Cannot update reviews, you are not a member in this interview');
    }

    if (!review.to.equals(interview.interviewer) && !review.to.equals(interview.interviewee)) {
      throw ApiError.badRequest('Cannot update reviews, the another user is not a member in this interview');
    }

    if (review.to.equals(review.from)) {
      throw ApiError.badRequest('Cannot update reviews, users must be different');
    }

    if (!interview.isFinished || interview.status !== InterviewStatus.Finished) {
      throw ApiError.badRequest('Cannot update reviews, interview not finished yet');
    }

    if (!interview.info) {
      throw ApiError.badRequest('Cannot update reviews, interview info is required');
    }

    const savedReviewIndex = interview.info.reviews!.findIndex((review) => review.from.equals(user._id));

    if (savedReviewIndex === -1) {
      interview.info.reviews!.push(review);
    } else {
      interview.info.reviews![savedReviewIndex] = review;
    }

    const updatedInterview = await interview.save();
    return updatedInterview;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function book(interview: IInterview, user: AuthenticatedUser) {
  try {
    const [interviewerPromise, intervieweePromise] = [
      userService.getById(interview.interviewer),
      userService.getById(interview.interviewee),
    ];

    const [interviewer, interviewee] = await Promise.all([interviewerPromise, intervieweePromise]);

    if (interviewer.role !== Role.Interviewer) {
      throw ApiError.badRequest('Cannot save interview, interviewee cannot make interviews');
    }

    if (!interviewer.info || !interviewee.info) {
      throw ApiError.badRequest('Cannot save interview, user info is required');
    }

    if (!user._id.equals(interview.interviewer) && !user._id.equals(interview.interviewee)) {
      throw ApiError.badRequest('Cannot save interview, you are not a member in this interview');
    }

    const savedInterview = await InterviewModel.create(interview);

    interviewer.info.interviewsMade.push(savedInterview._id);
    interviewee.info.interviewsHad.push(savedInterview._id);

    await Promise.all([interviewer.save(), interviewee.save()]);
    return savedInterview;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function reject(_id: Types.ObjectId, user: AuthenticatedUser) {
  try {
    const interview = await getById(_id);

    if (interview.status === InterviewStatus.Rejected) {
      return interview;
    }

    if (!user._id.equals(interview.interviewer) && !user._id.equals(interview.interviewee)) {
      throw ApiError.badRequest('Cannot reject interview, you are not a member in this interview');
    }

    if (interview.isFinished || interview.status !== InterviewStatus.Pending) {
      throw ApiError.badRequest('Cannot reject interview, interview is either finished or in processing-stage');
    }

    interview.status = InterviewStatus.Rejected;
    const updatedInterview = await interview.save();
    return updatedInterview;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function confirm(_id: Types.ObjectId, user: AuthenticatedUser) {
  try {
    const interview = await getById(_id);

    if (!interview.interviewer.equals(user._id)) {
      throw ApiError.badRequest('You cannot confirm this interview');
    }

    if (interview.isFinished || interview.status !== InterviewStatus.Pending) {
      throw ApiError.badRequest('Interview is either finished or in processing stage.');
    }
    
    interview.status = InterviewStatus.Confirmed;
    await interview.save();
  } catch (error) {
    throw ApiError.from(error);
  }
}
