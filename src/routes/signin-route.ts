import { Router } from 'express';

import * as signinController from '../controllers/signin-controller';
import * as githubAuthentication from '../middlewares/github-authentication';
import * as googleAuthentication from '../middlewares/google-authentication';
import * as validator from '../middlewares/validator';
import signinSchema from '../validations/signin-schema';

const router: Router = Router();

router.post('/', validator.validate(signinSchema), signinController.signin);
router.post('/google', googleAuthentication.authenticateByAccessToken);
router.post('/github', githubAuthentication.authenticateByAccessToken);

export default router;
