import Joi from 'joi';
import { Role } from '../enums/role-enum';

import IUser from '../interfaces/users/user-interface';

const signupByProviderSchema: Joi.ObjectSchema<IUser> = Joi.object<IUser>({
  email: Joi.string().email().lowercase().required(),
  role: Joi.string().valid(...[Role.Interviewee, Role.Interviewer]).required(),
});

export default signupByProviderSchema;
