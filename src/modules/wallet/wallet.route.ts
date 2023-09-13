import { Router } from 'express';
import * as walletController from './wallet.controller';
import { authenticateUserJwt } from '../../middlewares/authenticate';

const router = Router();
router.use(authenticateUserJwt);
router.get('/', (_req, res) => res.send('Welcome to NexaPay Wallet Service'));

/**
 * @swagger
 *  /v1/wallet/deposit:
 *   post:
 *     summary: User deposit
 *     description: A user deposits money into wallet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Deposit transaction details.
 */
router.post('/deposit', walletController.depositFunds);

/**
 * @swagger
 *  /v1/wallet/withdraw:
 *   post:
 *     summary: User withdrawal
 *     description: A user withdraws money from wallet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Withdrawal transaction details.
 */
router.post('/withdraw', walletController.withdrawFunds);

/**
 * @swagger
 *  /v1/wallet/transfer:
 *   post:
 *     summary: User transfer
 *     description: A user transfers money to another user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               amount:
 *                 type: number
 *               receiverEmail:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Transfer transaction details.
 */
router.post('/transfer', walletController.transferFunds);

/**
 * @swagger
 * /v1/wallet/balance/:walletId:
 *   parameters:
 *     - in: path
 *       name: walletId
 *       required: true
 *       description: The user's wallet ID.
 *       schema:
 *         type: integer
 *         format: int64
 *   get:
 *     summary: Get a user's wallet details
 *     description: Retrieve a user's wallet balance.
 *     responses:
 *       '200':
 *         description: A user's wallet details & balance.
 */
router.get('/balance/:walletId', walletController.getWalletBalance);

/**
 * @swagger
 * /v1/wallet/transactions/:walletId:
 *   parameters:
 *     - in: path
 *       name: walletId
 *       required: true
 *       description: The user's wallet ID.
 *       schema:
 *         type: integer
 *         format: int64
 *   get:
 *     summary: Get a user's transaction details
 *     description: Retrieve all transactions for a user.
 *     responses:
 *       '200':
 *         description: A user's transaction history.
 */
router.get('/transactions/:walletId', walletController.getTransactionHistory);

export default router;
