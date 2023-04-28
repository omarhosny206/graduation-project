import Joi from 'joi';

import ISocials from '../interfaces/users/socials-interface';
import IUserInfo from '../interfaces/users/user-info-interface';

const userUpdateSocialsSchema: Joi.ObjectSchema<IUserInfo> = Joi.object<IUserInfo>({
  socials: Joi.object<ISocials>({ github: Joi.string(), linkedin: Joi.string(), twitter: Joi.string() }).required(),
});

export default userUpdateSocialsSchema;
