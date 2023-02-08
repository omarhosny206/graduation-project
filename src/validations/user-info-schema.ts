import Joi from 'joi';
import ISocials from '../interfaces/users/socials-interface';
import IUserInfo from '../interfaces/users/user-info-interface';


const userInfoSchema: Joi.ObjectSchema<IUserInfo> = Joi.object<IUserInfo>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  bio: Joi.string(),
  interests: Joi.array().items(Joi.string()),
  skills: Joi.array().items(Joi.string()),
  socials: Joi.object<ISocials>({ github: Joi.string(), linkedin: Joi.string(), twitter: Joi.string() }),
});

export default userInfoSchema;
