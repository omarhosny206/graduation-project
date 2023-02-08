import { model, Schema } from 'mongoose';
import IUserInfo from '../interfaces/users/user-info-interface';
import IUser from '../interfaces/users/user-interface';

const userInfoSchema = new Schema<IUserInfo>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    priceable: { type: Boolean, required: true, default: false },
    interests: { type: [{ type: String }], required: false, default: [] },
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
    },
    bio: { type: String, required: false, default: '' },
    interviewsHad: [{ type: Schema.Types.ObjectId, ref: 'Interview' }],
    interviewsMade: [{ type: Schema.Types.ObjectId, ref: 'Interview' }],
    socials: {
      type: {
        linkedin: { type: String, required: false },
        github: { type: String, required: false },
        twitter: { type: String, required: false },
      },
      required: false,
    },
  },
  {
    versionKey: false,
  }
);

const UserInfoModel = model<IUserInfo>('UserInfo', userInfoSchema);
export default UserInfoModel;
