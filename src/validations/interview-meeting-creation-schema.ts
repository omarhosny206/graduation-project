import Joi from 'joi';

const interviewMeetingCreationSchema = Joi.object({
  _id: Joi.string().required(),
});

export default interviewMeetingCreationSchema;
