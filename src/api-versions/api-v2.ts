import { Router } from 'express';

import signupRoute2 from '../routes/signup-route2';
import userRoute2 from '../routes/user-route2';

const router: Router = Router();

router.use('/signup', signupRoute2);
router.use('/users', userRoute2);

export default router;
