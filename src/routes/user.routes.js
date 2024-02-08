import { Router } from "express";
import { getUser, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addSampleData } from "../controllers/test.controller.js";

const router=Router();
// router.route("/:userId").get("getUserDetail")
router.route("/signup").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/find").get(verifyJWT,getUser)
router.route("/test").get(addSampleData);
export default router;