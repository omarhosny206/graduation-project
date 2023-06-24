import { Router } from 'express';

import * as paymentController from '../controllers/payment-controller';
import { authenticateByAccessToken } from '../middlewares/authentication';
import { authorizeByRole } from '../middlewares/authorization';
import { Role } from '../enums/role-enum';
import * as validator from '../middlewares/validator';
import interviewCreateOrderSchema from '../validations/interview-create-order-schema';

const router: Router = Router();

router.get('/onboard', authenticateByAccessToken, authorizeByRole(Role.Interviewer), paymentController.onboardUser);
router.get(
  '/onboard/finish',
  authenticateByAccessToken,
  authorizeByRole(Role.Interviewer),
  paymentController.finishOnboarding
);
router.post(
  '/orders',
    authenticateByAccessToken,
    authorizeByRole(Role.Interviewee, Role.Interviewer),
  validator.validate(interviewCreateOrderSchema),
  paymentController.createOrder
);
router.post('/orders/:orderId/capture', paymentController.capturePayment);

export default router;
