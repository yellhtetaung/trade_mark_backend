import { Router } from "express";

import UserRoute from "./users/users.route.mjs";
import TradeMarkRoute from "./trade-mark/trade-mark.route.mjs";

const router = Router();

router.use("/api/users", UserRoute);
router.use("/api/trade-mark", TradeMarkRoute);

export default router;
