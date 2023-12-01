const { Router } = require("express");

const UserRoute = require("./users/users.route.js");
const TradeMarkRoute = require("./trade-mark/trade-mark.route.js");
const AuthRoute = require("./authentication/auth.route.js");

const router = Router();

router.use("/api/auth", AuthRoute);
router.use("/api/users", UserRoute);
router.use("/api/trade-mark", TradeMarkRoute);

module.exports = router;
