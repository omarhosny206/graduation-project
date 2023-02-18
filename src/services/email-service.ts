import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import ApiError from '../utils/api-error';
import * as jwt from '../utils/jwt';

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const EMAIL_CONFIRMATION_ENDPOINT = process.env.EMAIL_CONFIRMATION_ENDPOINT;
const EMAIL_UPDATING_ENDPOINT = process.env.EMAIL_UPDATING_ENDPOINT;
const RESET_PASSWORD_ENDPOINT = process.env.RESET_PASSWORD_ENDPOINT;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

export async function sendEmailConfirmation(email: string) {
  try {
    const emailConfirmationToken = await jwt.generateEmailConfirmationToken(email);
    const subject = '[Pass] Please confirm your email address';
    const body = `<b>Click this <a href=${EMAIL_CONFIRMATION_ENDPOINT}/${emailConfirmationToken}> link </a></b>`;

    const mailOptions: Mail.Options = {
      from: GMAIL_USER,
      to: email,
      subject: subject,
      html: body,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function sendEmailUpdating(email: string) {}

export async function sendResetPassword(email: string) {
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

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw ApiError.from(error);
  }
}
