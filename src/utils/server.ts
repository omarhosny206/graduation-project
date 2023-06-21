import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request } from 'express';

import apiV1 from '../api-versions/api-v1';
import apiV2 from '../api-versions/api-v2';
import * as errorHandler from '../middlewares/error-handler';
import * as notFoundHandler from '../middlewares/not-found-handler';

dotenv.config();

export const app: Express = express();

app.use(cors<Request>());
app.use(express.json());

app.use('/api/v1', apiV1);
app.use('/api/v2', apiV2);

app.use(notFoundHandler.handle);
app.use(errorHandler.handle);