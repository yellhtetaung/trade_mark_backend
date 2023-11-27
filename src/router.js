const { Router } = require("express");

const UserRoute = require("./users/users.route.js");
const TradeMarkRoute = require("./trade-mark/trade-mark.route.js");

const router = Router();

router.use("/api/users", UserRoute);
router.use("/api/trade-mark", TradeMarkRoute);

module.exports = router;
