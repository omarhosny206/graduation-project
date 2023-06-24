import { model, Schema } from 'mongoose';

import IUser from '../interfaces/users/user-interface';
import { ALL_LEVEL_OF_EXPERIENCES } from '../utils/all-level-of-experiences';
import { ALL_ROLES } from '../utils/all-roles';

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, minlength: 8, required: true },
    confirmed: { type: Boolean, required: false, default: false },
    active: { type: Boolean, required: false, default: true },
    role: { type: String, required: true, enum: ALL_ROLES },
    imageKey: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    info: {
      type: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        price: { type: Number, required: true, default: 0 },
        priceable: { type: Boolean, required: true, default: false },
        skills: { type: [{ type: String }], required: false, default: [] },
        timeslots: {
          type: [
            {
              hours: [{ type: String }],
              day: { type: Number },
            },
          ],
          required: false,
          default: [],
          _id: false,
        },
        bio: { type: String, required: false, default: '' },
        levelOfExperience: { type: String, required: true, enum: ALL_LEVEL_OF_EXPERIENCES },
        interviewsHad: [{ type: Schema.Types.ObjectId }],
        interviewsMade: [{ type: Schema.Types.ObjectId }],
        socials: {
          type: {
            linkedin: { type: String, required: false },
            github: { type: String, required: false },
            twitter: { type: String, required: false },
          },
          required: false,
          _id: false,
        },
        merchantId: { type: String, required: false },
      },
      required: false,
      _id: false,
    },
  },
  {
    versionKey: false,
  }
);

const UserModel = model<IUser>('User', userSchema);
export default UserModel;
