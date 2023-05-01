import { Router } from 'express';

import interviewRoute2 from '../routes/interview-route2';
import signupRoute2 from '../routes/signup-route2';
import userRoute2 from '../routes/user-route2';

const router: Router = Router();

router.use('/signup', signupRoute2);
router.use('/users', userRoute2);
router.use('/interviews', interviewRoute2);

export default router;
