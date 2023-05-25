import { Types } from 'mongoose';
import ISocials from './socials-interface';
import ITimeslot from './timeslot-interface';
import { LevelOfExperience } from '../../enums/level-of-experience-enum';

export default interface IUserInfo {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  bio?: string;
  levelOfExperience: LevelOfExperience;
  price: number;
  priceable: boolean;
  interviewsHad: Types.ObjectId[];
  interviewsMade: Types.ObjectId[];
  skills?: string[];
  socials?: ISocials;
  timeslots: ITimeslot[];
  merchantId?: string;
}
