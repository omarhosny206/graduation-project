import { Router } from 'express';

import * as signupController from '../controllers/signup-controller';
import * as validator from '../middlewares/validator';
import signupSchema from '../validations/signup-schema';

const router: Router = Router();
router.post('/', validator.validate(signupSchema), signupController.signup2);

export default router;
