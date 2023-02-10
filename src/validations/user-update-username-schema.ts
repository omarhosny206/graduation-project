import Joi from 'joi';

import IUser from '../interfaces/users/user-interface';

const userUpdateUsernameSchema: Joi.ObjectSchema<IUser> = Joi.object<IUser>({
  username: Joi.string().lowercase().required(),
});

export default userUpdateUsernameSchema;
