import Joi from 'joi';

import IPasswordUpdate from '../interfaces/users/password-update-interface';

const userUpdatePasswordSchema: Joi.ObjectSchema<IPasswordUpdate> = Joi.object<IPasswordUpdate>({
  oldPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().min(8).required(),
});

export default userUpdatePasswordSchema;
