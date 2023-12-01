const { Router } = require("express");
const {
	getAllHandler,
	createHandler,
	updateHandler,
	searchHandler,
	deleteHandler,
} = require("./users.controller");

const router = Router();

router.route("/").get(getAllHandler).post(createHandler);
router.route("/:id").put(updateHandler).delete(deleteHandler);
router.route("/search").get(searchHandler);

module.exports = router;
