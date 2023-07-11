import { NextFunction, Request, Response } from 'express';

import { Types } from 'mongoose'

import * as paymentService from '../services/payment-service';
import * as interviewService from '../services/interview-service';
import * as transactionService from '../services/transaction-service';
import { StatusCode } from '../enums/status-code-enum';
import ITransaction from '../interfaces/transactions/transaction-interface';

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
    const authenticatedUser = req.authenticatedUser;
    const { merchantId } = req.body;
    console.log(authenticatedUser);
    const updatedUser = await paymentService.finishOnboarding(authenticatedUser, merchantId);
    return res.status(StatusCode.Ok).json(updatedUser);
  } catch (error) {
    next(error);
  }
}

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { interviewId } = req.body;
    const interview = await interviewService.getById(interviewId);
    const order = await paymentService.createOrder(interview);
    console.log(order);
    res.status(StatusCode.Ok).json(order);
  } catch (error) {
    next(error);
  }
}

export async function capturePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderId } = req.params;
    const { interviewId } = req.body;
    const capturedPayment = await paymentService.capturePayment(orderId);
    const transaction = <ITransaction> {
      paypalId: capturedPayment.id,
      interview: new Types.ObjectId(interviewId),
      payer: capturedPayment.payment_source.paypal.email_address,
      payee: capturedPayment.purchase_units[0].payment_instruction.platform_fees[0].payee.email_address,
      currencyCode: capturedPayment.purchase_units[0].payment_instruction.platform_fees[0].amount.currency_code,
      totalPrice: +capturedPayment.purchase_units[0].payments.captures[0].seller_receivable_breakdown.gross_amount.value,
      paypalFee: +capturedPayment.purchase_units[0].payments.captures[0].seller_receivable_breakdown.paypal_fee.value,
      platformFee: +capturedPayment.purchase_units[0].payments.captures[0].seller_receivable_breakdown.platform_fees[0].amount.value,
      status: capturedPayment.status,
    }
    const savedTransaction = await transactionService.save(transaction);
    res.status(StatusCode.Created).json(savedTransaction);
  } catch (error) {
    next(error);
  }
}
