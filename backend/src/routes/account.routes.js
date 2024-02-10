import {Router} from 'express'
import { verifyJWT } from '../middleware/auth.middleware.js';
import { getUserAccount, getUserTransactions, transferMoney } from '../controllers/account.controller.js';

const router=Router();

router.route("/").get(verifyJWT,getUserAccount)
router.route("/transfer").patch(verifyJWT,transferMoney)
router.route("/transactions").get(verifyJWT,getUserTransactions)
export default router;