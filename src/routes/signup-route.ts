import { Router } from 'express';

import * as signupController from '../controllers/signup-controller';
import * as validator from '../middlewares/validator';
import signupByProviderSchema from '../validations/signup-by-provider-schema';
import signupSchema from '../validations/signup-schema';

const router: Router = Router();
router.post('/', validator.validate(signupSchema), signupController.signup);
router.post('/google', validator.validate(signupByProviderSchema), signupController.signupByProviders);
router.post('/github', validator.validate(signupByProviderSchema), signupController.signupByProviders);
router.post('/twitter', validator.validate(signupByProviderSchema), signupController.signupByProviders);
router.post('/linkedin', validator.validate(signupByProviderSchema), signupController.signupByProviders);

export default router;
