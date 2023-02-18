import Joi from 'joi';

import IReview from '../interfaces/interviews/review-interface';

const interviewUpdateReviewSchema: Joi.ObjectSchema<IReview> = Joi.object<IReview>({
  to: Joi.string().required(),
  from: Joi.string().required(),
  feedback: Joi.string().required(),
  rating: Joi.number().min(0).max(5).required(),
});

export default interviewUpdateReviewSchema;
