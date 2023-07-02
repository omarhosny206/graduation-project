import Joi from 'joi';

import ISocials from '../interfaces/users/socials-interface';
import IUserInfo from '../interfaces/users/user-info-interface';

const userUpdateSocialsSchema: Joi.ObjectSchema<IUserInfo> = Joi.object<IUserInfo>({
  socials: Joi.object<ISocials>({
    github: Joi.string().allow("").required(),
    linkedin: Joi.string().allow("").required(),
    twitter: Joi.string().allow("").required(),
  }).required(),
});

export default userUpdateSocialsSchema;
