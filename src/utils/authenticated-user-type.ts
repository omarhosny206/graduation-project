import { Document, Types } from 'mongoose';

import IUser from '../interfaces/users/user-interface';

export type AuthenticatedUser = Document<unknown, any, IUser> &
  IUser &
  Required<{
    _id: Types.ObjectId;
  }>;
