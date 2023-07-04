import ITransaction from '../interfaces/transactions/transaction-interface';
import TransactionModel from '../models/transaction-model';
import ApiError from '../utils/api-error';

export async function save(transaction: ITransaction) {
  try {
    const transactionToBeSaved: ITransaction = await TransactionModel.create(transaction);
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
