import Joi from 'joi';

const userForgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
});

export default userForgotPasswordSchema;
