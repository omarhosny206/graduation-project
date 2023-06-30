import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import IInterview from '../interfaces/interviews/interview-interface';
import IUser from '../interfaces/users/user-interface';
import ApiError from '../utils/api-error';
import * as dateFormatter from '../utils/date-formatter';
import * as jwt from '../utils/jwt';

const GMAIL_USER = process.env.GMAIL_USER!!;
const GMAIL_PASS = process.env.GMAIL_PASS!!;
const EMAIL_CONFIRMATION_ENDPOINT = process.env.EMAIL_CONFIRMATION_ENDPOINT;
const EMAIL_UPDATE_ENDPOINT = process.env.EMAIL_UPDATE_ENDPOINT;
const RESET_PASSWORD_ENDPOINT = process.env.RESET_PASSWORD_ENDPOINT;
const INTERVIEW_MEETING_URL_TIME_DIFFERENCE = Number.parseInt(process.env.INTERVIEW_MEETING_URL_TIME_DIFFERENCE!!);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

export async function sendEmailConfirmation(email: string) {
  try {
    const mailOptions = await getEmailConfirmationMailOptions(email);
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function sendEmailUpdate(email: string) {
  try {
    const mailOptions = await getEmailUpdateMailOptions(email);
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function sendResetPassword(email: string) {
  try {
    const mailOptions = await getResetPasswordMailOptions(email);
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function sendVideoMeetingEmails(interviewer: IUser, interviewee: IUser, interview: IInterview) {
  try {
    const [interviewerMailOptions, intervieweeMailOptions] = await getVideoMeetingMailOptions(
      interviewer,
      interviewee,
      interview
    );
    await Promise.all([transporter.sendMail(interviewerMailOptions), transporter.sendMail(intervieweeMailOptions)]);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function sendPendedInterviewEmails(interviewer: IUser, interviewee: IUser, interview: IInterview) {
  try {
    const [interviewerMailOptions, intervieweeMailOptions] = await getPendedInterviewMailOptions(
      interviewer,
      interviewee,
      interview
    );
    await Promise.all([transporter.sendMail(interviewerMailOptions), transporter.sendMail(intervieweeMailOptions)]);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function sendConfirmedInterviewEmails(interviewer: IUser, interviewee: IUser, interview: IInterview) {
  try {
    const [interviewerMailOptions, intervieweeMailOptions] = await getConfirmedInterviewMailOptions(
      interviewer,
      interviewee,
      interview
    );
    await Promise.all([transporter.sendMail(interviewerMailOptions), transporter.sendMail(intervieweeMailOptions)]);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function sendRejectedInterviewEmails(
  interviewer: IUser,
  interviewee: IUser,
  interview: IInterview,
  rejectedByInterviewer: boolean
) {
  try {
    const [interviewerMailOptions, intervieweeMailOptions] = await getRejectedInterviewMailOptions(
      interviewer,
      interviewee,
      interview,
      rejectedByInterviewer
    );
    await Promise.all([transporter.sendMail(interviewerMailOptions), transporter.sendMail(intervieweeMailOptions)]);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function sendFinishedInterviewEmails(interviewer: IUser, interviewee: IUser, interview: IInterview) {
  try {
    const [interviewerMailOptions, intervieweeMailOptions] = await getFinishedInterviewMailOptions(
      interviewer,
      interviewee,
      interview
    );
    await Promise.all([transporter.sendMail(interviewerMailOptions), transporter.sendMail(intervieweeMailOptions)]);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getEmailConfirmationMailOptions(email: string) {
  try {
    const emailConfirmationToken = await jwt.generateEmailConfirmationToken(email);
    const subject = '[Pass] Please confirm your email address';
    const body = `<b>Click this <a href=${EMAIL_CONFIRMATION_ENDPOINT}/${emailConfirmationToken}> link </a></b>`;

    return { from: GMAIL_USER, to: email, html: body, subject: subject };
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getVideoMeetingMailOptions(interviewer: IUser, interviewee: IUser, interview: IInterview) {
  try {
    const date = new Date(interview.date.getTime() + INTERVIEW_MEETING_URL_TIME_DIFFERENCE);
    const subject = '[Pass] Interview Video Meeting';
    const body = `<a href="http://localhost:8080/api/v1/interviews/${
      interview._id
    }"> Interview </a> <p>Interviewer: <a href="http://localhost:8080/api/v1/users/${interviewer.username}"> ${
      interviewer.username
    } </a></p> <p>Interviewee: <a href="http://localhost:8080/api/v1/users/${interviewee.username}"> ${
      interviewee.username
    } </a></p> <b><a href=${interview.meetingUrl}> Meeting URL </a></b> <p>Date: ${dateFormatter.format(
      date
    )}</p> <p>Note: you can only join the scheduled meeting five minutes prior to the starting time.</p>`;

    const interviewerMailOptions = { from: GMAIL_USER, to: interviewer.email, html: body, subject: subject };
    const intervieweeMailOptions = { from: GMAIL_USER, to: interviewee.email, html: body, subject: subject };
    return [interviewerMailOptions, intervieweeMailOptions];
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getPendedInterviewMailOptions(interviewer: IUser, interviewee: IUser, interview: IInterview) {
  try {
    const subject = `[Pass] Interview has been booked with status [PENDING]`;
    const interviewerBody = `<a href="http://localhost:8080/api/v1/interviews/${interview._id}"> Interview </a> <p>Interviewer: <a href="http://localhost:8080/api/v1/users/${interviewer.username}"> ${interviewer.username} </a></p> <p>Interviewee: <a href="http://localhost:8080/api/v1/users/${interviewee.username}"> ${interviewee.username}</a></p> <p>Note: you can either confirm or reject this interview</p>`;
    const intervieweeBody = `<a href="http://localhost:8080/api/v1/interviews/${interview._id}"> Interview </a> <p>Interviewer: <a href="http://localhost:8080/api/v1/users/${interviewer.username}"> ${interviewer.username} </a></p> <p>Interviewee: <a href="http://localhost:8080/api/v1/users/${interviewee.username}"> ${interviewee.username}</a></p> <p>Note: you can reject this interview before the interviewer's confirmation</p>`;

    const interviewerMailOptions = { from: GMAIL_USER, to: interviewer.email, html: interviewerBody, subject: subject };
    const intervieweeMailOptions = { from: GMAIL_USER, to: interviewee.email, html: intervieweeBody, subject: subject };
    return [interviewerMailOptions, intervieweeMailOptions];
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getConfirmedInterviewMailOptions(interviewer: IUser, interviewee: IUser, interview: IInterview) {
  try {
    const subject = `[Pass] Interview status [CONFIRMED]`;
    let interviewerBody = `<a href="http://localhost:8080/api/v1/interviews/${interview._id}"> Interview </a> <p>Interviewer: <a href="http://localhost:8080/api/v1/users/${interviewer.username}"> ${interviewer.username} </a></p> <p>Interviewee: <a href="http://localhost:8080/api/v1/users/${interviewee.username}"> ${interviewee.username}`;
    let intervieweeBody = `<a href="http://localhost:8080/api/v1/interviews/${interview._id}"> Interview </a> <p>Interviewer: <a href="http://localhost:8080/api/v1/users/${interviewer.username}"> ${interviewer.username} </a></p> <p>Interviewee: <a href="http://localhost:8080/api/v1/users/${interviewee.username}"> ${interviewee.username}`;

    if (!interview.isPaid) {
      intervieweeBody = intervieweeBody.concat(' <p>PAY NOW!</p>');
    }
    const interviewerMailOptions = { from: GMAIL_USER, to: interviewer.email, html: interviewerBody, subject: subject };
    const intervieweeMailOptions = { from: GMAIL_USER, to: interviewee.email, html: intervieweeBody, subject: subject };
    return [interviewerMailOptions, intervieweeMailOptions];
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getRejectedInterviewMailOptions(
  interviewer: IUser,
  interviewee: IUser,
  interview: IInterview,
  rejectedByInterviewer: boolean
) {
  try {
    let subject = `[Pass] Interview status [REJECTED`;
    let body = `<a href="http://localhost:8080/api/v1/interviews/${interview._id}"> Interview </a> <p>Interviewer: <a href="http://localhost:8080/api/v1/users/${interviewer.username}"> ${interviewer.username} </a></p> <p>Interviewee: <a href="http://localhost:8080/api/v1/users/${interviewee.username}"> ${interviewee.username}`;

    if (rejectedByInterviewer) {
      subject = subject.concat(' by Interviewer]');
    } else {
      subject = subject.concat(' by Interviewee]');
    }

    const interviewerMailOptions = { from: GMAIL_USER, to: interviewer.email, html: body, subject: subject };
    const intervieweeMailOptions = { from: GMAIL_USER, to: interviewee.email, html: body, subject: subject };
    return [interviewerMailOptions, intervieweeMailOptions];
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getFinishedInterviewMailOptions(interviewer: IUser, interviewee: IUser, interview: IInterview) {
  try {
    const subject = `[Pass] Interview status [FINISHED]`;
    let body = `<a href="http://localhost:8080/api/v1/interviews/${interview._id}"> Interview </a> <p>Interviewer: <a href="http://localhost:8080/api/v1/users/${interviewer.username}"> ${interviewer.username} </a></p> <p>Interviewee: <a href="http://localhost:8080/api/v1/users/${interviewee.username}"> ${interviewee.username} <p>Add info and review NOW!!!</p>`;

    const interviewerMailOptions = { from: GMAIL_USER, to: interviewer.email, html: body, subject: subject };
    const intervieweeMailOptions = { from: GMAIL_USER, to: interviewee.email, html: body, subject: subject };
    return [interviewerMailOptions, intervieweeMailOptions];
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getEmailUpdateMailOptions(email: string) {
  try {
    const emailUpdateToken = await jwt.generateEmailUpdatingToken(email);
    const subject = '[Pass] Request for email update';
    const body = `<b>Click this <a href=${EMAIL_UPDATE_ENDPOINT}/${emailUpdateToken}> link </a></b>`;

    const mailOptions: Mail.Options = {
      from: GMAIL_USER,
      to: email,
      subject: subject,
      html: body,
    };

    return mailOptions;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function getResetPasswordMailOptions(email: string) {
  try {
    const resetPasswordToken = await jwt.generateResetPasswordToken(email);
    const subject = '[Pass] Please reset your password';
    const body = `<b>Click this <a href=${RESET_PASSWORD_ENDPOINT}/${resetPasswordToken}> link </a></b>`;

    const mailOptions: Mail.Options = {
      from: GMAIL_USER,
      to: email,
      subject: subject,
      html: body,
    };

    return mailOptions;
  } catch (error) {
    throw ApiError.from(error);
  }
}
