import { Router } from 'express';

import * as signupController from '../controllers/signup-controller';
import * as validator from '../middlewares/validator';
import signupByGithubSchema from '../validations/signup-by-provider-schema';
import signupByGoogleSchema from '../validations/signup-by-google-schema';
import * as signupByLinkedinSchema from '../validations/signup-by-linkedin-schema';
import signupByTwitterSchema from '../validations/signup-by-twitter-schema';
import signupSchema from '../validations/signup-schema';

const router: Router = Router();
router.post('/', validator.validate(signupSchema), signupController.signup);
router.post('/google', validator.validate(signupByGoogleSchema), signupController.signupByProviders);
router.post('/github', validator.validate(signupByGithubSchema), signupController.signupByProviders);
router.post('/twitter', validator.validate(signupByTwitterSchema), signupController.signupByProviders);
router.post('/linkedin', validator.validate(signupByLinkedinSchema), signupController.signupByProviders);

export default router;
