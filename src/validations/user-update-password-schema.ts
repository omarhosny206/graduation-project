import Joi from 'joi';

import IPasswordUpdate from '../interfaces/users/password-update-interface';

const passwordValidation = Joi.string()
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  .message(
    '"{#label}": Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
  )
  .required();

const userUpdatePasswordSchema: Joi.ObjectSchema<IPasswordUpdate> = Joi.object<IPasswordUpdate>({
  oldPassword: passwordValidation.label('old password'),
  newPassword: passwordValidation.label('new password'),
  confirmPassword: passwordValidation.label('confirm password'),
});

export default userUpdatePasswordSchema;
