import { NextFunction, Request, Response } from 'express';

import * as paymentService from '../services/payment-service';
import * as interviewService from '../services/interview-service';
import { StatusCode } from '../enums/status-code-enum';

export async function onboardUser(req: Request, res: Response, next: NextFunction) {
  try {
    const paypalRes = await paymentService.onboardUser();
    return res.status(StatusCode.Ok).json(paypalRes);
  } catch (error) {
    next(error);
  }
}

export async function finishOnboarding(req: Request, res: Response, next: NextFunction) {
  try {
    const { authenticatedUser, merchantId } = req.body;
    const updatedUser = await paymentService.finishOnboarding(authenticatedUser, merchantId);
    return res.status(StatusCode.Ok).json(updatedUser);
  } catch (error) {
    next(error);
  }
}

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { _id } = req.body;
    console.log('_id');
    console.log(_id);
    const interview = await interviewService.getById(_id);
    const order = await paymentService.createOrder(interview);
    console.log('order');
    console.log(order);
    res.status(StatusCode.Ok).json(order);
  } catch (error) {
    next(error);
  }
}

export async function capturePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderId } = req.params;
    const capturedPayment = await paymentService.capturePayment(orderId);
    console.log('captured payment');
    console.log(JSON.stringify(capturedPayment));
    res.status(StatusCode.Ok).json(capturedPayment);
  } catch (error) {
    next(error);
  }
}
