import { Router } from "express";

import * as signupController from "../controllers/signup-controller";
import * as validator from "../middlewares/validator";
import signupByGithubSchema from "../validations/signup-by-github-schema";
import signupByGoogleSchema from "../validations/signup-by-google-schema";
import signupSchema from "../validations/signup-schema";

const router: Router = Router();

router.post("/", validator.validate(signupSchema), signupController.signup);
router.post("/google", validator.validate(signupByGoogleSchema), signupController.signupByProviders);
router.post("/github", validator.validate(signupByGithubSchema), signupController.signupByProviders);

export default router;
