import Joi from 'joi';

import ISocials from '../interfaces/users/socials-interface';
import IUserInfo from '../interfaces/users/user-info-interface';

const userUpdateSocialsSchema: Joi.ObjectSchema<IUserInfo> = Joi.object<IUserInfo>({
  socials: Joi.object<ISocials>({
    github: Joi.string().empty("").required(),
    linkedin: Joi.string().empty("").required(),
    twitter: Joi.string().empty("").required(),
  }).required(),
});

export default userUpdateSocialsSchema;
