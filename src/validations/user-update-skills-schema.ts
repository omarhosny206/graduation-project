import Joi from 'joi';

import IUserInfo from '../interfaces/users/user-info-interface';

const userUpdateSkillsSchema: Joi.ObjectSchema<IUserInfo> = Joi.object<IUserInfo>({
  skills: Joi.array().items(Joi.string().required()).required(),
});

export default userUpdateSkillsSchema;
