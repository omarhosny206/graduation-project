import Joi from 'joi';

const finishOnboardingSchema = Joi.object({
  merchantId: Joi.string().message("merchantId is not valid").required(),
});

export default finishOnboardingSchema;
