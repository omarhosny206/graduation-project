import { Router } from "express";

import * as expiredAccessTokenHandler from "../middlewares/expired-access-token-handler";

const router: Router = Router();

router.post("/", expiredAccessTokenHandler.regenerateTokens);

export default router;
