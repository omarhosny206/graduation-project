import * as cron from 'cron';

import * as interviewService from './interview-service';

const CronJob = cron.CronJob;

const CRON_TIME_DIFFERENCE = Number.parseInt(process.env.CRON_TIME_DIFFERENCE!!);

const CRON_JOB_EXPRESSION = '22 * * * *';
export const markInterviewsAsFinishedCronJob = new CronJob(
  CRON_JOB_EXPRESSION,
  markInterviewsAsFinished,
  null,
  true,
  'Africa/Cairo'
);
export const markInterviewsAsRejectedCronJob = new CronJob(
  CRON_JOB_EXPRESSION,
  markInterviewsAsRejected,
  null,
  true,
  'Africa/Cairo'
);

async function markInterviewsAsFinished() {
  try {
    const currentDate = new Date(Date.now() + CRON_TIME_DIFFERENCE);
    console.log(`FINISHED time now --> ${currentDate.getHours()}:${currentDate.getMinutes()}`);
    await interviewService.markAsFinished(currentDate);
    console.log('FINISHED done ###');
    console.log();
  } catch (error) {
    console.log('ERROR in markInterviewsAsFinished');
  }
}

async function markInterviewsAsRejected() {
  try {
    const currentDate = new Date(Date.now() + CRON_TIME_DIFFERENCE);
    console.log(`REJECTED time now --> ${currentDate.getHours()}:${currentDate.getMinutes()}`);
    await interviewService.markAsRejected(currentDate);
    console.log('REJECTED done ###');
    console.log();
  } catch (error) {
    console.log('ERROR in markInterviewsAsRejected');
  }
}
