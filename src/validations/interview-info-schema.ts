import Joi from 'joi';
import IInterviewInfo from '../interfaces/interviews/interview-info-interface';
import IReview from '../interfaces/interviews/review-interface';

const interviewInfoSchema: Joi.ObjectSchema<IInterviewInfo> = Joi.object<IInterviewInfo>({
  title: Joi.string().required(),
  summary: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  youtubeUrl: Joi.string(),
  reviews: Joi.array().items(
    Joi.object<IReview>({
      to: Joi.string().required(),
      from: Joi.string().required(),
      feedback: Joi.string().required(),
      rating: Joi.number().min(0).max(5).required(),
    })
  ),
});

export default interviewInfoSchema;
