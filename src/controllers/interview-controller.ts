import { NextFunction, Request, Response } from 'express';

import { StatusCode } from '../enums/status-code-enum';
import IInterview from '../interfaces/interviews/interview-interface';
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

export async function save(req: Request, res: Response, next: NextFunction) {
  try {
    const interview: IInterview = req.body;
    const savedInterview: IInterview = await interviewService.save(interview);
    return res.status(StatusCode.Created).json(savedInterview);
  } catch (error) {
    return next(error);
  }
}
