import Joi from 'joi';

import IReview from '../interfaces/interviews/review-interface';

const interviewUpdateReviewSchema: Joi.ObjectSchema<IReview> = Joi.object<IReview>({
  to: Joi.string().regex(/^[0-9a-fA-F]{24}$/).message("to is not a valid objectid").required(),
  from: Joi.string().regex(/^[0-9a-fA-F]{24}$/).message("from is not a valid objectid").required(),
  feedback: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
});

export default interviewUpdateReviewSchema;
