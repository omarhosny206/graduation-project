import { Types } from 'mongoose';
import { InterviewStatus } from '../enums/interview-status-enum';
import { Role } from '../enums/role-enum';
import IInterview from '../interfaces/interviews/interview-interface';
import InterviewModel from '../models/interview-model';
import * as userService from '../services/user-service';
import ApiError from '../utils/api-error';

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

    if (!user) {
      throw ApiError.badRequest('Cannot get interviews had, user not found');
    }

    const interviewsHad = await InterviewModel.find({ interviewee: user._id });
    return interviewsHad;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getInterviewsMade(username: string) {
  try {
    const user = await userService.getByUserName(username);

    if (!user) {
      throw ApiError.badRequest('Cannot get interviews made, user not found');
    }

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
    return interview;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function book(interview: IInterview) {
  try {
    const [interviewerPromise, intervieweePromise] = [
      userService.getById(interview.interviewer),
      userService.getById(interview.interviewee),
    ];

    const [interviewer, interviewee] = await Promise.all([interviewerPromise, intervieweePromise]);

    if (!interviewer || !interviewee) {
      throw ApiError.badRequest('Cannot save interview, user not found');
    }

    if (interviewer.role !== Role.Interviewer) {
      throw ApiError.badRequest('Cannot save interview, interviewee cannot make interviews');
    }

    if (!interviewer.info || !interviewee.info) {
      throw ApiError.badRequest('Cannot save interview, user info is required');
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

export async function confirm(_id: Types.ObjectId, userId: Types.ObjectId) {
  try {
    const interview = await getById(_id);
    if (!interview) {
      throw ApiError.badRequest('Interview not found');
    }
    if (!interview.interviewer.equals(userId)) {
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
