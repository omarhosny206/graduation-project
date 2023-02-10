import { Router } from 'express';

import * as interviewController from '../controllers/interview-controller';
import * as authentication from '../middlewares/authentication';
import * as authorization from '../middlewares/authorization';
import * as validator from '../middlewares/validator';
import { Role } from '../enums/role-enum';
import interviewSchema from '../validations/interview-schema';

const router: Router = Router();

router.get('/', interviewController.getAll);
router.get('/interviews-had/:username', interviewController.getInterviewsHad);
router.get('/interviews-made/:username', interviewController.getInterviewsMade);
router.post(
  '/',
  authentication.authenticateByAccessToken,
  authorization.authorizeByRole(Role.Interviewee, Role.Interviewer),
  validator.validate(interviewSchema),
  interviewController.save
);

export default router;
