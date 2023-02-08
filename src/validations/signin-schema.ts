import Joi from 'joi';

import IUser from '../interfaces/users/user-interface';

const signinSchema: Joi.ObjectSchema<IUser> = Joi.object<IUser>({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
});

export default signinSchema;
