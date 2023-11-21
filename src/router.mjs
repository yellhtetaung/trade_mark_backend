import { Router } from "express";

import UserRoute from "./users/users.route.mjs";

const router = Router();

router.use("/api/users", UserRoute);

export default router;
