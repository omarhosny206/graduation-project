import * as cron from 'cron';

import * as interviewService from './interview-service';

const CronJob = cron.CronJob;

const CRON_JOB_EXPRESSION = '1 * * * *';
export const markInterviewAsFinishedCronJob = new CronJob(
  CRON_JOB_EXPRESSION,
  markInterviewAsFinished,
  null,
  true,
  'Africa/Cairo'
);
export const markInterviewAsRejectedCronJob = new CronJob(
  CRON_JOB_EXPRESSION,
  markInterviewAsRejected,
  null,
  true,
  'Africa/Cairo'
);

async function markInterviewAsFinished() {
  const currentDate = new Date(Date.now() + 1 * 60 * 60 * 1000);
  console.log(`FINISHED time now --> ${currentDate.getHours()}:${currentDate.getMinutes()}`);
  await interviewService.markAsFinished(currentDate);
  console.log('FINISHED done ###');
  console.log();
}

async function markInterviewAsRejected() {
  const currentDate = new Date(Date.now() + 1 * 60 * 60 * 1000);
  console.log(`REJECTED time now --> ${currentDate.getHours()}:${currentDate.getMinutes()}`);
  await interviewService.markAsRejected(currentDate);
  console.log('REJECTED done ###');
  console.log();
}
