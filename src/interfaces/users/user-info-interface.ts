import { Types } from 'mongoose';

import { LevelOfExperience } from '../../enums/level-of-experience-enum';
import ISocials from './socials-interface';
import ITimeslot from './timeslot-interface';

export default interface IUserInfo {
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
  devicesTokens?: string[];
}
