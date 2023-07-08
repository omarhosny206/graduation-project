import { Router } from 'express';

import * as paymentController from '../controllers/payment-controller';
import { authenticateByAccessToken } from '../middlewares/authentication';
import { authorizeByRole } from '../middlewares/authorization';
import { Role } from '../enums/role-enum';
import * as validator from '../middlewares/validator';
import interviewCreateOrderSchema from '../validations/interview-create-order-schema';
import captureOrderSchema from '../validations/capture-order-schema';
import finishOnboardingSchema from '../validations/finish-onboarding-schema';

const router: Router = Router();

router.get('/onboard', authenticateByAccessToken, authorizeByRole(Role.Interviewer), paymentController.onboardUser);
router.put(
  '/onboard/finish',
  authenticateByAccessToken,
  authorizeByRole(Role.Interviewer),
  validator.validate(finishOnboardingSchema),
  paymentController.finishOnboarding
);
router.post(
  '/orders',
  authenticateByAccessToken,
  authorizeByRole(Role.Interviewee, Role.Interviewer),
  validator.validate(interviewCreateOrderSchema),
  paymentController.createOrder
);
router.post(
  '/orders/:orderId/capture',
  authenticateByAccessToken,
  authorizeByRole(Role.Interviewee, Role.Interviewer),
  validator.validate(captureOrderSchema),
  paymentController.capturePayment
);

export default router;
