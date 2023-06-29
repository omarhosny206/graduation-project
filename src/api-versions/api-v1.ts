import { Router } from 'express';

import expiredAccessTokenHandlerRoute from '../routes/expired-access-token-handler-route';
import interviewRoute from '../routes/interview-route';
import signinRoute from '../routes/signin-route';
import signupRoute from '../routes/signup-route';
import userRoute from '../routes/user-route';
import paymentRoute from '../routes/payment-route';

const router: Router = Router();

router.use('/signup', signupRoute);
router.use('/signin', signinRoute);
router.use('/users', userRoute);
router.use('/interviews', interviewRoute);
router.use('/tokens', expiredAccessTokenHandlerRoute);
router.use('/payments', paymentRoute);

export default router;
