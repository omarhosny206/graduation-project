import * as cron from 'cron';
import * as interviewService from './interview-service';
const CronJob = cron.CronJob;

const CRON_JOB_EXPRESSION = '1 * * * *';
export const cronJob = new CronJob(CRON_JOB_EXPRESSION, markInterviewAsFinished, null, true, 'Africa/Cairo');


async function markInterviewAsFinished() {
  const currentDate = new Date();
  console.log(`time now --> ${currentDate.getHours()}:${currentDate.getMinutes()}`);
  await interviewService.markAsFinished(currentDate);
  console.log('DONE ###');
  console.log();
}
