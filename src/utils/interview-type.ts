import { Document, Types } from 'mongoose';
import IInterview from '../interfaces/interviews/interview-interface';

export type Interview = Document<unknown, any, IInterview> &
  IInterview &
  Required<{
    _id: Types.ObjectId;
  }>;
