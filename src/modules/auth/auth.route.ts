import { Router } from 'express';
import * as authController from './auth.controller';

const router = Router();
router.get('/', (_req, res) => res.send('Welcome to Demo Credit Auth Service'));

/**
 * @swagger
 *  /v1/auth/signup:
 *   post:
 *     summary: Login a user
 *     description: Log a user into Demo Credit Service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Bearer token and user details.
 */
router.post('/login', authController.login);

/**
 * @swagger
 *  /v1/auth/login:
 *   post:
 *     summary: Signup a new user
 *     description: Register a new user to Demo Credit Service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       '201':
 *         description: New user details.
 */
router.post('/signup', authController.signup);

export default router;
