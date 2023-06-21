import mongoose from 'mongoose';
import IInterview from '../../interfaces/interviews/interview-interface';
import { InterviewStatus } from '../../enums/interview-status-enum';
import { interviewId, interviewId2, interviewId3, interviewId4, intervieweeId, interviewerId } from './ids';
import InterviewModel from '../../models/interview-model';

export const interviews: { [key: string]: IInterview } = {
  pending: {
    _id: interviewId2,
    interviewee: intervieweeId,
    interviewer: interviewerId,
    date: new Date('2023-06-15T12:00:00.000+00:00'),
    price: 30,
    meetingUrl: '',
    isPaid: false,
    status: InterviewStatus.Pending,
  },
  pending2: {
    _id: interviewId3,
    interviewee: intervieweeId,
    interviewer: interviewerId,
    date: new Date('2023-06-15T12:00:00.000+00:00'),
    price: 30,
    meetingUrl: '',
    isPaid: false,
    status: InterviewStatus.Pending,
  },
  pending3: {
    _id: interviewId4,
    interviewee: intervieweeId,
    interviewer: interviewerId,
    date: new Date('2023-06-15T12:00:00.000+00:00'),
    price: 30,
    meetingUrl: '',
    isPaid: false,
    status: InterviewStatus.Pending,
  },
  rejected: {
    _id: new mongoose.Types.ObjectId(),
    interviewee: intervieweeId,
    interviewer: interviewerId,
    date: new Date('2023-06-15T12:00:00.000+00:00'),
    price: 30,
    meetingUrl: '',
    isPaid: false,
    status: InterviewStatus.Rejected,
  },
  confirmedAndNotPaid: {
    _id: new mongoose.Types.ObjectId(),
    interviewee: intervieweeId,
    interviewer: interviewerId,
    date: new Date('2023-06-20T12:00:00.000+00:00'),
    price: 30,
    meetingUrl: '',
    isPaid: false,
    status: InterviewStatus.Confirmed,
  },
  confirmedAndPaid: {
    _id: new mongoose.Types.ObjectId(),
    interviewee: intervieweeId,
    interviewer: interviewerId,
    date: new Date('2023-06-20T12:00:00.000+00:00'),
    price: 30,
    meetingUrl: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    isPaid: true,
    status: InterviewStatus.Confirmed,
  },
  finished: {
    _id: interviewId,
    interviewee: intervieweeId,
    interviewer: interviewerId,
    date: new Date('2023-06-15T12:00:00.000+00:00'),
    price: 30,
    meetingUrl: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    isPaid: true,
    status: InterviewStatus.Finished,
    info: {
      title: 'Amazon interview',
      summary: 'Data Structures and Algorithms interview',
      youtubeUrl: '...',
      tags: ['Graph', 'Tree', 'BFS', 'DFS'],
      reviews: [
        {
          from: interviewerId,
          to: intervieweeId,
          rating: 3,
          feedback: 'great interviewee with high experience and communication skills',
        },
        {
          from: intervieweeId,
          to: interviewerId,
          rating: 5,
          feedback: 'great interviewer with high experience and communication skills',
        },
      ],
    },
  },
};

export async function saveInterviews() {
  try {
    await Promise.all([
      InterviewModel.create(interviews.pending),
      InterviewModel.create(interviews.pending2),
      InterviewModel.create(interviews.pending3),
      InterviewModel.create(interviews.rejected),
      InterviewModel.create(interviews.confirmedAndNotPaid),
      InterviewModel.create(interviews.confirmedAndPaid),
      InterviewModel.create(interviews.finished),
    ]);
  } catch (error) {
    console.log('NOT SAVED:', error.message);
  }
}
