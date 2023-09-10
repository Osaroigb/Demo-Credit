import { Router } from 'express';
import * as walletController from './wallet.controller';
import { authenticateUserJwt } from '../../middlewares/authenticate';

const router = Router();
router.use(authenticateUserJwt);

router.get('/', (_req, res) => res.send('Welcome to Demo Credit Wallet Service'));
router.post('/deposit', walletController.depositFunds);

// router.post('/transfer', walletController.transferFunds);
// router.post('/withdraw', walletController.withdrawFunds);
// router.get('/transactions', walletController.getTransactions);

export default router;
