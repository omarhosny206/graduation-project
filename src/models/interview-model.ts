import { model, Schema } from 'mongoose';

import { InterviewStatus } from '../enums/interview-status-enum';
import IInterview from '../interfaces/interviews/interview-interface';
import { ALL_STATUS } from '../utils/all-status';

const interviewSchema = new Schema<IInterview>(
  {
    interviewee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    interviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    meetingUrl: { type: String, default: '' },
    info: {
      type: {
        title: { type: String, required: true },
        summary: { type: String, required: true },
        youtubeUrl: { type: String, required: false },
        tags: { type: [String], required: true },
        reviews: {
          type: [
            {
              from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
              to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
              rating: { type: Number, required: true, min: 1, max: 5 },
              feedback: { type: String, required: true },
            },
          ],
          required: false,
          _id: false,
        },
      },
      required: false,
      _id: false,
    },
    price: { type: Number, required: true, min: 0 },
    isPaid: { type: Boolean, required: true, default: false },
    status: { type: String, enum: ALL_STATUS, required: true, default: InterviewStatus.Pending },
  },
  {
    versionKey: false,
  }
);

const InterviewModel = model<IInterview>('Interview', interviewSchema);
export default InterviewModel;
