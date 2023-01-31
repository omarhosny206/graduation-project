import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request } from 'express';

import { connectToDb } from './config/mongo-config';
import * as errorHandler from './middlewares/error-handler';
import * as notFoundHandler from './middlewares/not-found-handler';
import expiredAccessTokenHandlerRoute from './routes/expired-access-token-handler-route';
import signinRoute from './routes/signin-route';
import signupRoute from './routes/signup-route';
import userRoute from './routes/user-route';

dotenv.config();

const app: Express = express();
const PORT: string | undefined = process.env.PORT;

app.use(cors<Request>());
app.use(express.json());

app.use('/signup', signupRoute);
app.use('/signin', signinRoute);
app.use('/users', userRoute);
app.use('/token', expiredAccessTokenHandlerRoute);

app.use(notFoundHandler.handle);
app.use(errorHandler.handle);

app.listen(PORT, async () => {
    console.log('Server is running ....');
    await connectToDb();
});
