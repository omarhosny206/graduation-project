import { Schema, model } from 'mongoose';
import ITransaction from '../interfaces/transactions/transaction-interface';
import { TransactionStatus } from '../enums/transaction-status';

const transactionSchema = new Schema<ITransaction>(
  {
    paypalId: { type: String, required: true, unique: true },
    interview: { type: Schema.Types.ObjectId, ref: 'Interview', required: true },
    payer: { type: String, required: true },
    payee: { type: String, required: true },
    currencyCode: { type: String },
    totalPrice: { type: Number, required: true },
    paypalFee: { type: Number },
    platformFee: { type: Number },
    status: { type: String, enum: TransactionStatus, required: true, default: TransactionStatus.Created },
  },
  {
    toJSON: {
      transform(doc: any, ret: any) {
        delete ret._id;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
    versionKey: false,
  }
);

const TransactionModel = model<ITransaction>('Transaction', transactionSchema);
export default TransactionModel;
