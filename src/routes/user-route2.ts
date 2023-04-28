import { Router } from 'express';

import * as userController from '../controllers/user-controller';
import * as authentication from '../middlewares/authentication';
import * as validator from '../middlewares/validator';
import userForgotPasswordSchema from '../validations/user-forgot-password-schema';
import userUpdateEmailSchema from '../validations/user-update-email-schema';

const router: Router = Router();

router.post('/forgot-password', validator.validate(userForgotPasswordSchema), userController.forgotPassword2);
router.put(
  '/email',
  authentication.authenticateByAccessToken,
  validator.validate(userUpdateEmailSchema),
  userController.requestEmailUpdate2
);

export default router;
