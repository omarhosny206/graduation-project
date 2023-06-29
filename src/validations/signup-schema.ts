import Joi from 'joi';
import { Role } from '../enums/role-enum';

import IUser from '../interfaces/users/user-interface';

const signupSchema: Joi.ObjectSchema<IUser> = Joi.object<IUser>({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .message(
      'password: Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    ).required(),
  role: Joi.string()
    .valid(...[Role.Interviewee, Role.Interviewer])
    .required(),
});

export default signupSchema;
