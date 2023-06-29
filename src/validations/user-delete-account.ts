import Joi from 'joi';

const userDeleteAccount = Joi.object({
  email: Joi.string().email().lowercase().required(),
});

export default userDeleteAccount;
