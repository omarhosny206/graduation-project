import Joi from 'joi';

import IUser from '../interfaces/users/user-interface';

const userUpdateEmailSchema: Joi.ObjectSchema<IUser> = Joi.object<IUser>({
  email: Joi.string().email().lowercase().required(),
});

export default userUpdateEmailSchema;
