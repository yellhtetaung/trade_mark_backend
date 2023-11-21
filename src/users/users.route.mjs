import { Router } from "express";
import {
	getAllUsers,
	searchUser,
	createUser,
	updateUser,
} from "./users.controller.mjs";

const router = Router();

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").put(updateUser);
router.route("/search").get(searchUser);

export default router;
