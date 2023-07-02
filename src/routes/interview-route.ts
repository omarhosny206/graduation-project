import { Router } from 'express';

import * as interviewController from '../controllers/interview-controller';
import { Role } from '../enums/role-enum';
import * as authentication from '../middlewares/authentication';
import * as authorization from '../middlewares/authorization';
import * as validator from '../middlewares/validator';
import * as queryStringValidator from '../middlewares/query-string-validator';
import interviewInfoSchema from '../validations/interview-info-schema';
import interviewSchema from '../validations/interview-schema';
import interviewUpdateReviewSchema from '../validations/interview-update-review-schema';
import interviewTypeQueryStringSchema from '../validations/interview-type-query-string-schema';
import interviewStatusQueryStringSchema from '../validations/interview-status-query-string-schema';

const router: Router = Router();

router.get(
  '/',
  authentication.authenticateByAccessToken,
  queryStringValidator.validate(interviewTypeQueryStringSchema, 'type'),
  queryStringValidator.validate(interviewStatusQueryStringSchema, 'status'),
  interviewController.getAllByStatusAndType
);
router.get('/search', interviewController.search);
router.get('/interviews-had/:username', interviewController.getInterviewsHad);
router.get('/interviews-made/:username', interviewController.getInterviewsMade);
router.post(
  '/',
  authentication.authenticateByAccessToken,
  authorization.authorizeByRole(Role.Interviewee, Role.Interviewer),
  validator.validate(interviewSchema),
  interviewController.book
);
router.get('/:_id', interviewController.getProfile);
router.put(
  '/:_id',
  authentication.authenticateByAccessToken,
  authorization.authorizeByRole(Role.Interviewee, Role.Interviewer),
  validator.validate(interviewInfoSchema),
  interviewController.update
);
router.put(
  '/:_id/reviews',
  authentication.authenticateByAccessToken,
  authorization.authorizeByRole(Role.Interviewee, Role.Interviewer),
  validator.validate(interviewUpdateReviewSchema),
  interviewController.updateReview
);
router.put(
  '/:_id/rejection',
  authentication.authenticateByAccessToken,
  authorization.authorizeByRole(Role.Interviewee, Role.Interviewer),
  interviewController.reject
);
router.put(
  '/:_id/confirmation',
  authentication.authenticateByAccessToken,
  authorization.authorizeByRole(Role.Interviewer),
  interviewController.confirm
);

export default router;
