import Joi from 'joi';
import { InterviewStatus } from '../enums/interview-status-enum';

const interviewStatusQueryStringSchema: Joi.ObjectSchema = Joi.object({
  status: Joi.string()
    .valid(InterviewStatus.Pending, InterviewStatus.Confirmed, InterviewStatus.Rejected, InterviewStatus.Finished)
    .required(),
});

export default interviewStatusQueryStringSchema;
