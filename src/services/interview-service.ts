import { Types } from 'mongoose';

import { InterviewStatus } from '../enums/interview-status-enum';
import { Role } from '../enums/role-enum';
import IInterviewInfo from '../interfaces/interviews/interview-info-interface';
import IInterview from '../interfaces/interviews/interview-interface';
import IReview from '../interfaces/interviews/review-interface';
import IUser from '../interfaces/users/user-interface';
import InterviewModel from '../models/interview-model';
import * as emailPublisherService from '../services/email-publisher-service';
import * as emailService from '../services/email-service';
import * as userService from '../services/user-service';
import * as videoMeetingService from '../services/video-meeting-service';
import ApiError from '../utils/api-error';
import { AuthenticatedUser } from '../utils/authenticated-user-type';
import { Interview } from '../utils/interview-type';
import { InterviewType } from '../enums/interview-type-enum';

const MARK_AS_REJECTED_TIME_DIFFERENCE = Number.parseInt(process.env.MARK_AS_REJECTED_TIME_DIFFERENCE!!);
const MARK_AS_FINISHED_TIME_DIFFERENCE = Number.parseInt(process.env.MARK_AS_FINISHED_TIME_DIFFERENCE!!);

export async function getAll() {
  try {
    const interviews = await InterviewModel.find();
    return interviews;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getInterviewsHad(username: string) {
  try {
    const user = await userService.getByUserName(username);
    const interviewsHad = await InterviewModel.find({ interviewee: user._id }).populate('interviewer interviewee');
    return interviewsHad;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getInterviewsMade(username: string) {
  try {
    const user = await userService.getByUserName(username);
    if (user.role === Role.Interviewee) {
      throw ApiError.badRequest('Cannot get interviews made, interviewee role is not allowed to make interviews');
    }
    const interviewsHad = await InterviewModel.find({ interviewer: user._id }).populate('interviewer interviewee');
    return interviewsHad;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getById(_id: Types.ObjectId) {
  try {
    const interview = await InterviewModel.findById(_id);

    if (!interview) {
      throw ApiError.badRequest('interview not found with this id');
    }

    return interview;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getProfile(_id: Types.ObjectId) {
  try {
    const interview = await InterviewModel.findById(_id).populate('interviewer interviewee');

    if (!interview) {
      throw ApiError.badRequest('interview not found with this id');
    }

    return interview;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function search(filterCriteria: any) {
  try {
    const fieldsToFilterBy = Object.keys(filterCriteria);

    const singleValueFilters = fieldsToFilterBy
      .filter((field) => !(filterCriteria[field] instanceof Array))
      .map((field) => ({
        text: {
          query: filterCriteria[field] as string,
          path: field,
          fuzzy: {},
        },
      }));

    const multipleValuesFilters = fieldsToFilterBy
      .filter((field) => filterCriteria[field] instanceof Array)
      .map((field) =>
        filterCriteria[field].map((value: string) => ({
          text: {
            query: value,
            path: field,
            fuzzy: {},
          },
        }))
      );

    const filters = [...singleValueFilters];
    multipleValuesFilters.forEach((filter) => filters.push(...filter));

    console.log('FILTERS : ', filters);

    let interviews = await InterviewModel.aggregate([
      {
        $search: {
          index: 'interviews_search_index',
          compound: {
            must: filters,
          },
        },
      },
      {
        $project: {
          score: { $meta: 'searchScore' },
          document: '$$ROOT',
        },
      },
    ]).sort({ score: -1 });

    interviews = interviews.map((interview) => ({ _id: interview._id, score: interview.score, ...interview.document }));
    return interviews;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function update(_id: Types.ObjectId, user: AuthenticatedUser, interviewInfo: IInterviewInfo) {
  try {
    const interview = await getById(_id);

    if (!user._id.equals(interview.interviewer) && !user._id.equals(interview.interviewee)) {
      throw ApiError.badRequest('Cannot update info, you are not a member in this interview');
    }

    if (interview.status !== InterviewStatus.Finished) {
      throw ApiError.badRequest('Cannot update info, interview not finished yet');
    }

    if (interview.info) {
      Object.assign(interview.info, interviewInfo);
    } else {
      interview.info = interviewInfo;
    }

    const updatedInterview = await interview.save();
    return updatedInterview;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function updateReview(_id: Types.ObjectId, user: AuthenticatedUser, review: IReview) {
  try {
    const interview = await getById(_id);

    if (!user._id.equals(review.from)) {
      throw ApiError.badRequest('Cannot update reviews, you are not the author of this review');
    }

    if (!user._id.equals(interview.interviewer) && !user._id.equals(interview.interviewee)) {
      throw ApiError.badRequest('Cannot update reviews, you are not a member in this interview');
    }

    if (!review.to.equals(interview.interviewer) && !review.to.equals(interview.interviewee)) {
      throw ApiError.badRequest('Cannot update reviews, the another user is not a member in this interview');
    }

    if (review.to.equals(review.from)) {
      throw ApiError.badRequest('Cannot update reviews, users must be different');
    }

    if (interview.status !== InterviewStatus.Finished) {
      throw ApiError.badRequest('Cannot update reviews, interview not finished yet');
    }

    if (!interview.info) {
      throw ApiError.badRequest('Cannot update reviews, interview info is required');
    }

    const savedReviewIndex = interview.info.reviews!.findIndex((review) => review.from.equals(user._id));

    if (savedReviewIndex === -1) {
      interview.info.reviews!.push(review);
    } else {
      interview.info.reviews![savedReviewIndex] = review;
    }

    const updatedInterview = await interview.save();
    return updatedInterview;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function book(interview: IInterview, user: AuthenticatedUser) {
  try {
    const [interviewer, interviewee] = await Promise.all([
      userService.getById(interview.interviewer),
      userService.getById(interview.interviewee),
    ]);

    if (interviewer.role !== Role.Interviewer) {
      throw ApiError.badRequest('Cannot save interview, interviewee cannot make interviews');
    }

    if (!interviewer.info || !interviewee.info) {
      throw ApiError.badRequest('Cannot save interview, user info is required');
    }

    if (!user._id.equals(interview.interviewer) && !user._id.equals(interview.interviewee)) {
      throw ApiError.badRequest('Cannot save interview, you are not a member in this interview');
    }

    if (interview.interviewer.equals(interview.interviewee)) {
      throw ApiError.badRequest('Cannot save interview, you are not allowed to make an interview with yourself');
    }

    interview.price = interviewer.info.price;
    if (interview.price === 0) {
      interview.isPaid = true;
    }

    const savedInterview = await InterviewModel.create(interview);

    interviewer.info.interviewsMade.push(savedInterview._id);
    interviewee.info.interviewsHad.push(savedInterview._id);

    await Promise.all([interviewer.save(), interviewee.save()]);
    handleSendingPendedInterviewEmails(savedInterview, interviewer, interviewee);
    return savedInterview;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function reject(_id: Types.ObjectId, user: AuthenticatedUser) {
  try {
    const interview = await getById(_id);

    if (!user._id.equals(interview.interviewer) && !user._id.equals(interview.interviewee)) {
      throw ApiError.badRequest('Cannot reject interview, you are not a member in this interview');
    }

    if (interview.status === InterviewStatus.Rejected) {
      return interview;
    }

    if (interview.status !== InterviewStatus.Pending) {
      throw ApiError.badRequest('Cannot reject interview, interview is either finished or confirmed');
    }

    interview.status = InterviewStatus.Rejected;
    const updatedInterview = await interview.save();
    handleSendingRejectedInterviewEmails(updatedInterview, user);
    return updatedInterview;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function confirm(_id: Types.ObjectId, user: AuthenticatedUser) {
  try {
    const interview = await getById(_id);

    if (interview.status === InterviewStatus.Confirmed) {
      return interview;
    }

    if (!interview.interviewer.equals(user._id)) {
      throw ApiError.badRequest('You cannot confirm this interview');
    }

    if (interview.status !== InterviewStatus.Pending) {
      throw ApiError.badRequest('Interview is either finished or rejected.');
    }

    interview.status = InterviewStatus.Confirmed;
    let updatedInterview = await interview.save();
    handleSendingConfirmedInterviewEmails(updatedInterview, user);

    if (interview.isPaid) {
      updatedInterview = await createMeetingUrl(updatedInterview);
    }

    return updatedInterview;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function markAsFinished(currentDate: Date) {
  try {
    const interviews = await getAll();

    const interviewsToMarkAsFinished = interviews.filter(
      (interview) =>
        interview.status == InterviewStatus.Confirmed &&
        interview.isPaid &&
        interview.date.getTime() + MARK_AS_FINISHED_TIME_DIFFERENCE <= currentDate.getTime()
    );

    await Promise.all(
      interviewsToMarkAsFinished.map(async (interview) => {
        console.log(`Interview (${interview._id}) marked as finished`);
        interview.status = InterviewStatus.Finished;
        handleSendingMarkedAsFinishedInterviewEmails(interview);
      })
    );

    await InterviewModel.bulkSave(interviewsToMarkAsFinished);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function markAsRejected(currentDate: Date) {
  try {
    const interviews = await getAll();

    const interviewsToMarkAsRejected = interviews.filter((interview) => {
      return (
        (interview.status == InterviewStatus.Confirmed &&
          !interview.isPaid &&
          interview.date.getTime() + MARK_AS_REJECTED_TIME_DIFFERENCE <= currentDate.getTime()) ||
        (interview.status == InterviewStatus.Pending &&
          interview.date.getTime() + MARK_AS_REJECTED_TIME_DIFFERENCE <= currentDate.getTime())
      );
    });

    await Promise.all(
      interviewsToMarkAsRejected.map(async (interview) => {
        console.log(`Interview (${interview._id}) marked as rejected`);
        interview.status = InterviewStatus.Rejected;
        handleSendingMarkedAsRejectedInterviewEmails(interview);
      })
    );

    await InterviewModel.bulkSave(interviewsToMarkAsRejected);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getInterviewsMadeWithReviews(user: IUser) {
  try {
    if (user.role === Role.Interviewee) {
      throw ApiError.badRequest('Cannot get interviews made, interviewee role is not allowed to make interviews');
    }
    const interviewsMade = await InterviewModel.find({ interviewer: user._id });
    const interviewsWithReviews = interviewsMade.filter((interview) => interview.info && interview.info.reviews);
    return interviewsWithReviews;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getInterviewsHadWithReviews(user: IUser) {
  try {
    const interviewsHad = await InterviewModel.find({ interviewee: user._id });
    const interviewsWithReviews = interviewsHad.filter((interview) => interview.info && interview.info.reviews);
    return interviewsWithReviews;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getInterviewsHadGroupedByStatus(username: string) {
  try {
    const interviewsHad = await getInterviewsHad(username);

    const groupedInterviewsHad = interviewsHad.reduce((acc: any, interview: IInterview) => {
      const status = interview.status;
      if (acc[status]) {
        acc[status].push(interview);
      } else {
        acc[status] = [interview];
      }
      return acc;
    }, {});

    return groupedInterviewsHad;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getInterviewsMadeGroupedByStatus(username: string) {
  try {
    const interviewsMade = await getInterviewsMade(username);

    const groupedInterviewsMade = interviewsMade.reduce((acc: any, interview: IInterview) => {
      const status = interview.status;
      if (acc[status]) {
        acc[status].push(interview);
      } else {
        acc[status] = [interview];
      }
      return acc;
    }, {});

    return groupedInterviewsMade;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function createMeetingUrl(interview: Interview) {
  try {
    if (interview.status !== InterviewStatus.Confirmed) {
      throw ApiError.badRequest('Cannot create meeting, interview is either finished or rejected or pended');
    }

    if (!interview.isPaid) {
      throw ApiError.badRequest('Cannot create meeting, must be paid first');
    }

    const [interviewer, interviewee] = await Promise.all([
      userService.getById(interview.interviewer),
      userService.getById(interview.interviewee),
    ]);

    const meeting = await videoMeetingService.create(interview.date);

    interview.meetingUrl = meeting.join_url;
    const updatedInterview = await interview.save();

    emailService.sendVideoMeetingEmails(interviewer, interviewee, interview);
    return updatedInterview;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function handleSendingRejectedInterviewEmails(interview: IInterview, user: AuthenticatedUser) {
  try {
    if (user._id.equals(interview.interviewer)) {
      emailService.sendRejectedInterviewEmails(user, await userService.getById(interview.interviewee), interview, true);
    } else {
      emailService.sendRejectedInterviewEmails(
        await userService.getById(interview.interviewer),
        user,
        interview,
        false
      );
    }
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function handleSendingConfirmedInterviewEmails(interview: IInterview, user: AuthenticatedUser) {
  try {
    emailService.sendConfirmedInterviewEmails(user, await userService.getById(interview.interviewee), interview);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function handleSendingPendedInterviewEmails(
  interview: IInterview,
  interviewer: IUser,
  interviewee: IUser
) {
  try {
    emailService.sendPendedInterviewEmails(interviewer, interviewee, interview);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function handleSendingMarkedAsRejectedInterviewEmails(interview: IInterview) {
  try {
    const [interviewer, interviewee] = await Promise.all([
      await userService.getById(interview.interviewer),
      await userService.getById(interview.interviewee),
    ]);
    emailService.sendRejectedInterviewEmails(interviewer, interviewee, interview, true);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function handleSendingMarkedAsFinishedInterviewEmails(interview: IInterview) {
  try {
    const [interviewer, interviewee] = await Promise.all([
      await userService.getById(interview.interviewer),
      await userService.getById(interview.interviewee),
    ]);
    emailService.sendFinishedInterviewEmails(interviewer, interviewee, interview);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getAllByStatusAndType(user: AuthenticatedUser, status: InterviewStatus, type: InterviewType) {
  try {
    let interviews = null;

    if (type === InterviewType.Made && user.role === Role.Interviewee) {
      throw ApiError.badRequest('Cannot get interviews made, interviewee role is not allowed to make interviews');
    }

    if (type === InterviewType.Had) {
      interviews = await InterviewModel.find({ interviewee: user._id, status: status });
    } else {
      interviews = await InterviewModel.find({ interviewer: user._id, status: status });
    }

    return interviews;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getAllFinishedInterviewsByType(user: IUser, type: InterviewType) {
  try {
    let interviews = null;

    if (type === InterviewType.Made && user.role === Role.Interviewee) {
      throw ApiError.badRequest('Cannot get interviews made, interviewee role is not allowed to make interviews');
    }

    if (type === InterviewType.Had) {
      interviews = await InterviewModel.find({ interviewee: user._id, status: InterviewStatus.Finished });
    } else {
      interviews = await InterviewModel.find({ interviewer: user._id, status: InterviewStatus.Finished });
    }

    return interviews;
  } catch (error) {
    throw ApiError.from(error);
  }
}
