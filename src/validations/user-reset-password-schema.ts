import Joi from 'joi';

import IPasswordReset from '../interfaces/users/password-reset-interface';

const userResetPasswordSchema: Joi.ObjectSchema<IPasswordReset> = Joi.object<IPasswordReset>({
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().min(8).required(),
});

export default userResetPasswordSchema;
