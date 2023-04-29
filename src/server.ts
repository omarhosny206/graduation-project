import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request } from 'express';

import apiV1 from './api-versions/api-v1';
import apiV2 from './api-versions/api-v2';
import { connectToDb } from './config/mongo-config';
import * as errorHandler from './middlewares/error-handler';
import * as notFoundHandler from './middlewares/not-found-handler';
import { markInterviewAsFinishedCronJob, markInterviewAsRejectedCronJob } from './services/cron-service';

dotenv.config();

const app: Express = express();
const PORT: string | undefined = process.env.PORT;

app.use(cors<Request>());
app.use(express.json());

app.use('/api/v1', apiV1);
app.use('/api/v2', apiV2);

app.use(notFoundHandler.handle);
app.use(errorHandler.handle);

markInterviewAsFinishedCronJob.start();
markInterviewAsRejectedCronJob.start();

app.listen(PORT, async () => {
  console.log('Server is running ....');
  await connectToDb();
});
