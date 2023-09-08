import { Router } from 'express';
import * as authController from './auth.controller';

const router = Router();
router.get('/', (_req, res) => res.send('Welcome to Demo Credit Auth Service'));

router.post('/login', authController.login);
router.post('/signup', authController.signup);

export default router;
