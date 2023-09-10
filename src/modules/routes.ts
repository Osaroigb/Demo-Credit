import { Router } from 'express';
import { routes as authRoutes } from './auth';
import { routes as walletRoutes } from './wallet';

export const initiateModuleRoutes = (router: Router): void => {
  router.use('/v1/auth', authRoutes);
  router.use('/v1/wallet', walletRoutes);
};
