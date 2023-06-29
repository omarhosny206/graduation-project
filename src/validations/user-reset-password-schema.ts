import Joi from 'joi';

import IPasswordReset from '../interfaces/users/password-reset-interface';

const passwordValidation = Joi.string()
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  .message(
    '"{#label}": Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
  )
  .required();
const userResetPasswordSchema: Joi.ObjectSchema<IPasswordReset> = Joi.object<IPasswordReset>({
  newPassword: passwordValidation.label('new password'),
  confirmPassword: passwordValidation.label('confirm password'),
});

export default userResetPasswordSchema;
