import { Types } from 'mongoose';
import IInterview from '../interviews/interview-interface';
import { TransactionStatus } from '../../enums/transaction-status';

export default interface ITransaction {
  _id: Types.ObjectId;
  paypalId: string;
  interview: Types.ObjectId | IInterview;
  payer: string;
  payee: string;
  currencyCode: string;
  totalPrice: number;
  paypalFee: number;
  platformFee: number;
  status: TransactionStatus;
}
