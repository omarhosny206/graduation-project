import { Role } from '../enums/role-enum';
import IInterview from '../interfaces/interviews/interview-interface';
import InterviewModel from '../models/interview-model';
import UserInfoModel from '../models/user-info-model';
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
  const user = await userService.getByUserName(username);

  if (!user) {
    throw ApiError.badRequest('Cannot get interviews had, user not found');
  }

  const interviewsHad = await InterviewModel.find({ interviewee: user._id });
  return interviewsHad;
}

export async function getInterviewsMade(username: string) {
  const user = await userService.getByUserName(username);

  if (!user) {
    throw ApiError.badRequest('Cannot get interviews made, user not found');
  }

  if (user.role === Role.Interviewee) {
    throw ApiError.badRequest('Cannot get interviews made, interviewee role is not allowed to make interviews');
  }

  const interviewsHad = await InterviewModel.find({ interviewer: user._id });
  return interviewsHad;
}

export async function save(interview: IInterview) {
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

  const [savedInterviewPromise, interviewerInfoPromise, intervieweeInfoPromise] = [
    InterviewModel.create(interview),
    UserInfoModel.findById(interviewer.info),
    UserInfoModel.findById(interviewee.info),
  ];

  const [savedInterview, interviewerInfo, intervieweeInfo] = await Promise.all([
    savedInterviewPromise,
    interviewerInfoPromise,
    intervieweeInfoPromise,
  ]);

  interviewerInfo?.interviewsMade.push(savedInterview._id);
  intervieweeInfo?.interviewsHad.push(savedInterview._id);

  await Promise.all([interviewerInfo?.save(), intervieweeInfo?.save()]);
  return savedInterview;
}
