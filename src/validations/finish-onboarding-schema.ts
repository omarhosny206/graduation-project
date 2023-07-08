import Joi from 'joi';

const finishOnboardingSchema = Joi.object({
  merchantId: Joi.string().required(),
});

export default finishOnboardingSchema;
