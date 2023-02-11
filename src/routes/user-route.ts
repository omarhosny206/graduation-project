import { Router } from 'express';

import * as userController from '../controllers/user-controller';
import { Role } from '../enums/role-enum';
import * as authentication from '../middlewares/authentication';
import * as authorization from '../middlewares/authorization';
import * as validator from '../middlewares/validator';
import userInfoSchema from '../validations/user-info-schema';
import userUpdatePriceSchema from '../validations/user-update-price-schema ';
import userUpdateUsernameSchema from '../validations/user-update-username-schema';

const router: Router = Router();

router.get('/', userController.getAll);
router.get('/filter', userController.filter);
// router.get('/:username', userController.getProfile);
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
// router.put(
//   '/timeslots',
//   authentication.authenticateByAccessToken,
//   authorization.authorizeByRole(Role.Interviewer),
//   userController.hasOverlappingTimeslots
// );
router.get('/:_id', authentication.authenticateByAccessToken, userController.getById);
router.delete(
  '/:_id',
  authentication.authenticateByAccessToken,
  // authorization.authorizeByRole(Role.Admin),
  userController.deleteById
);
router.put(
  '/timeslots',
  authentication.authenticateByAccessToken,
  authorization.authorizeByRole(Role.Interviewer),
  userController.editTimeslots
);
router.get('/interviewsMade/:username', userController.getInterviewsMade)
export default router;
