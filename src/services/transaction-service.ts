import { Types } from 'mongoose';

import ITransaction from '../interfaces/transactions/transaction-interface';
import TransactionModel from '../models/transaction-model';
import * as interviewService from '../services/interview-service';
import ApiError from '../utils/api-error';

export async function save(transaction: ITransaction) {
  try {
    const transactionToBeSaved: ITransaction = await TransactionModel.create(transaction);

    const interview = await interviewService.getById(transactionToBeSaved.interview as Types.ObjectId);
    interview.isPaid = true;
    const updatedInterview = await interview.save();
    await interviewService.createMeetingUrl(updatedInterview);

    return transactionToBeSaved;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function update(transaction: ITransaction) {
  try {
    const transactionToBeUpdated = await TransactionModel.findOneAndUpdate(
      { paypalId: transaction.paypalId },
      {
        payer: transaction.payer,
        payee: transaction.payee,
        currencyCode: transaction.currencyCode,
        paypalFee: transaction.paypalFee,
        platformFee: transaction.platformFee,
        status: transaction.status,
      }
    );
    return transactionToBeUpdated;
  } catch (error) {
    throw ApiError.from(error);
  }
}
