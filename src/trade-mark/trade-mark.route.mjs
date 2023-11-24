import { Router } from "express";
import {
	getAllHandler,
	searchHandler,
	createHandler,
	updateHandler,
} from "./trade-mark.controller.mjs";

const router = Router();

router.route("/").get(getAllHandler).post(createHandler);
router.route("/:id").put(updateHandler);
router.route("/search").get(searchHandler);

export default router;
