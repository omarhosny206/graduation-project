import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { StatusCode } from '../enums/status-code-enum';
import IInterviewInfo from '../interfaces/interviews/interview-info-interface';
import IInterview from '../interfaces/interviews/interview-interface';
import IReview from '../interfaces/interviews/review-interface';
import * as interviewService from '../services/interview-service';

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const interviews = await interviewService.getAll();
    return res.status(StatusCode.Ok).json(interviews);
  } catch (error) {
    return next(error);
  }
}

export async function getInterviewsHad(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const interviewsHad = await interviewService.getInterviewsHad(username);
    return res.status(StatusCode.Ok).json(interviewsHad);
  } catch (error) {
    return next(error);
  }
}

export async function getInterviewsMade(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const interviewsMade = await interviewService.getInterviewsMade(username);
    return res.status(StatusCode.Ok).json(interviewsMade);
  } catch (error) {
    return next(error);
  }
}

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const filterCriteria = req.query;

    console.log('req.query: ', filterCriteria);

    const interviews = await interviewService.search(filterCriteria);
    return res.status(StatusCode.Ok).json(interviews);
  } catch (error) {
    return next(error);
  }
}

export async function book(req: Request, res: Response, next: NextFunction) {
  try {
    const interview: IInterview = req.body;
    interview.interviewer = new mongoose.Types.ObjectId(interview.interviewer);
    interview.interviewee = new mongoose.Types.ObjectId(interview.interviewee);
    const authenticatedUser = req.authenticatedUser;
    const savedInterview: IInterview = await interviewService.book(interview, authenticatedUser);
    return res.status(StatusCode.Created).json(savedInterview);
  } catch (error) {
    return next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { _id } = req.params;
    const interview = await interviewService.getById(new mongoose.Types.ObjectId(_id));
    return res.status(StatusCode.Ok).json(interview);
  } catch (error) {
    next(error);
  }
}

export async function confirm(req: Request, res: Response, next: NextFunction) {
  try {
    const { _id } = req.params;
    const authenticatedUser = req.authenticatedUser;
    await interviewService.confirm(new mongoose.Types.ObjectId(_id), authenticatedUser);
  } catch (error) {
    next(error);
  }
}
export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const _id = new mongoose.Types.ObjectId(req.params._id);
    const interviewInfo: IInterviewInfo = req.body;
    const authenticatedUser = req.authenticatedUser;
    const updatedInterview = await interviewService.update(_id, authenticatedUser, interviewInfo);
    return res.status(StatusCode.Ok).json(updatedInterview);
  } catch (error) {
    return next(error);
  }
}

export async function updateReview(req: Request, res: Response, next: NextFunction) {
  try {
    const _id = new mongoose.Types.ObjectId(req.params._id);
    const review: IReview = req.body;
    review.to = new mongoose.Types.ObjectId(review.to);
    review.from = new mongoose.Types.ObjectId(review.from);
    const authenticatedUser = req.authenticatedUser;
    const updatedInterview = await interviewService.updateReview(_id, authenticatedUser, review);
    return res.status(StatusCode.Ok).json(updatedInterview);
  } catch (error) {
    return next(error);
  }
}

export async function reject(req: Request, res: Response, next: NextFunction) {
  try {
    const _id = new mongoose.Types.ObjectId(req.params._id);
    const authenticatedUser = req.authenticatedUser;
    const updatedInterview = await interviewService.reject(_id, authenticatedUser);
    return res.status(StatusCode.Ok).json(updatedInterview);
  } catch (error) {
    return next(error);
  }
}
