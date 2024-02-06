import { Router } from "express";
import { getUserDetail } from "../controllers/user.controller.js";

const router=Router();
router.route("/").get(getUserDetail)

export default router;