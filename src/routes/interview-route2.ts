import { Router } from 'express';

import * as interviewController from '../controllers/interview-controller';
import { Role } from '../enums/role-enum';
import * as authentication from '../middlewares/authentication';
import * as authorization from '../middlewares/authorization';
import * as validator from '../middlewares/validator';
import interviewMeetingCreationSchema from '../validations/interview-meeting-creation-schema';

const router: Router = Router();

router.post(
  '/meeting',
  authentication.authenticateByAccessToken,
  authorization.authorizeByRole(Role.Interviewee),
  validator.validate(interviewMeetingCreationSchema),
  interviewController.createMeetingUrl2
);

export default router;
