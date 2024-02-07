import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router=Router();
// router.route("/:userId").get("getUserDetail")
router.route("/signup").post(registerUser)

export default router;