import dotenv from 'dotenv';

import { connectToDb } from './config/mongo-config';
import { markInterviewsAsFinishedCronJob, markInterviewsAsRejectedCronJob } from './services/cron-service';
import { app } from './utils/server';

dotenv.config();
const PORT = process.env.PORT!!;

app.listen(PORT, async () => {
  console.log('Server is running ....');
  await connectToDb();
  markInterviewsAsFinishedCronJob.start();
  markInterviewsAsRejectedCronJob.start();
});
