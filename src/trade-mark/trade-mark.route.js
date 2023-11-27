const { Router } = require("express");
const {
	getAllHandler,
	createHandler,
	updateHandler,
	searchHandler,
} = require("./trade-mark.controller");

const router = Router();

router.route("/").get(getAllHandler).post(createHandler);
router.route("/:id").put(updateHandler);
router.route("/search").get(searchHandler);

module.exports = router;
