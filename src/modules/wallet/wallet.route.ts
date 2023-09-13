import { Router } from 'express';
import * as walletController from './wallet.controller';
import { authenticateUserJwt } from '../../middlewares/authenticate';

const router = Router();
router.use(authenticateUserJwt);

router.get('/', (_req, res) => res.send('Welcome to NexaPay Wallet Service'));
router.post('/deposit', walletController.depositFunds);
router.post('/withdraw', walletController.withdrawFunds);

router.post('/transfer', walletController.transferFunds);
router.get('/transactions/:walletId', walletController.getTransactionHistory);
router.get('/balance/:walletId', walletController.getWalletBalance);

export default router;
