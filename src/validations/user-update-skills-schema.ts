import Joi from 'joi';

import IUserInfo from '../interfaces/users/user-info-interface';
import { ALL_SKILLS } from '../utils/all-skills';

const userUpdateSkillsSchema: Joi.ObjectSchema<IUserInfo> = Joi.object<IUserInfo>({
  skills: Joi.array()
    .items(
      Joi.string()
        .valid(...ALL_SKILLS)
        .required()
    )
    .unique()
    .required(),
});

export default userUpdateSkillsSchema;
