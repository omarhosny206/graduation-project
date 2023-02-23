import { Router } from 'express';

import * as userController from '../controllers/user-controller';
import { Role } from '../enums/role-enum';
import * as authentication from '../middlewares/authentication';
import * as authorization from '../middlewares/authorization';
import * as validator from '../middlewares/validator';
import userInfoSchema from '../validations/user-info-schema';
import userUpdatePriceSchema from '../validations/user-update-price-schema';
import userUpdateTimeslotsSchema from '../validations/user-update-timeslots-schema';
import userUpdateUsernameSchema from '../validations/user-update-username-schema';
import userUpdatePasswordSchema from '../validations/user-update-password-schema';
import userResetPasswordSchema from '../validations/user-reset-password-schema';
import userForgotPasswordSchema from '../validations/user-forgot-password-schema';

const router: Router = Router();

router.get('/', userController.getAll);
router.get('/filter', userController.filter);
router.get('/interviews-made/:username', userController.getInterviewsMade);
router.get('/interviews-had/:username', userController.getInterviewsHad);
router.get('/:username', userController.getProfile);
router.get('/:_id', authentication.authenticateByAccessToken, userController.getById);

router.post('/email/confirmation/:emailConfirmationToken', userController.confirmEmail);
router.post('/forgot-password', validator.validate(userForgotPasswordSchema), userController.forgotPassword);
router.post(
  '/reset-password/:resetPasswordToken',
  validator.validate(userResetPasswordSchema),
  userController.resetPassword
);

router.put('/', authentication.authenticateByAccessToken, validator.validate(userInfoSchema), userController.update);
router.put(
  '/username',
  authentication.authenticateByAccessToken,
  validator.validate(userUpdateUsernameSchema),
  userController.updateUsername
);
router.put(
  '/role',
  authentication.authenticateByAccessToken,
  authorization.authorizeByRole(Role.Interviewee),
  userController.updateRole
);
router.put(
  '/price',
  authentication.authenticateByAccessToken,
  authorization.authorizeByRole(Role.Interviewer),
  validator.validate(userUpdatePriceSchema),
  userController.updatePrice
);
router.put(
  '/timeslots',
  authentication.authenticateByAccessToken,
  authorization.authorizeByRole(Role.Interviewer),
  validator.validate(userUpdateTimeslotsSchema),
  userController.editTimeslots
);
router.put(
  '/password',
  authentication.authenticateByAccessToken,
  validator.validate(userUpdatePasswordSchema),
  userController.updatePassword
);

router.delete(
  '/:_id',
  authentication.authenticateByAccessToken,
  // authorization.authorizeByRole(Role.Admin),
  userController.deleteById
);

router.put('/update-email', authentication.authenticateByAccessToken, userController.requestEmailUpdate);
router.put('/update-email/:emailUpdateToken', authentication.authenticateByAccessToken, userController.updateEmail);

export default router;
