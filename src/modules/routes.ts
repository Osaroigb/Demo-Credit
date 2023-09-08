import { Router } from 'express';
import { routes as authRoutes } from './auth';
// import { routes as creditRoutes } from './creditLending';

export const initiateModuleRoutes = (router: Router): void => {
  router.use('/v1/auth', authRoutes);
//   router.use('/v1/credit', creditRoutes);
};
