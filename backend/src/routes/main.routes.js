import { Router } from "express"
import userRouter from "./user.routes.js"
import accountRouter from "./account.routes.js"
const router=Router();

router.use('/user',userRouter)
router.use('/account',accountRouter)

export default router;
