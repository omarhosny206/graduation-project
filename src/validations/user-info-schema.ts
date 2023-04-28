import Joi from 'joi';
import IUserInfo from '../interfaces/users/user-info-interface';
import { ALL_LEVEL_OF_EXPERIENCES } from '../utils/all-level-of-experiences';

const userInfoSchema: Joi.ObjectSchema<IUserInfo> = Joi.object<IUserInfo>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  bio: Joi.string(),
  levelOfExperience: Joi.string().valid(...ALL_LEVEL_OF_EXPERIENCES).required(),
});

export default userInfoSchema;
