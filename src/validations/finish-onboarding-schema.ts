import Joi from 'joi';

const finishOnboardingSchema = Joi.object({
  merchantId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).message("merchantId is not a valid objectid").required(),
});

export default finishOnboardingSchema;
