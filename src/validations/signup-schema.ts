import Joi from 'joi';
import { Role } from '../enums/role-enum';

import IUser from '../interfaces/users/user-interface';

const signupSchema: Joi.ObjectSchema<IUser> = Joi.object<IUser>({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string()
    .valid(...[Role.Interviewee, Role.Interviewer])
    .required(),
});

export default signupSchema;
