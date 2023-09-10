import { RequestHandler } from 'express';
import { User } from '../auth/auth.interface';
import * as walletService from './wallet.service';
import * as walletValidation from './wallet.validation';
import { responseHandler } from '../../helpers/response';

export const depositFunds: RequestHandler = async (req: any, res, next) => {
  try {
    const userId = (req.user as User)?.id;
    const validData = walletValidation.validateTransactionRequestBody(req.body);

    const result = await walletService.processDepositFunds(validData, userId as number); 
    res.json(responseHandler(result.message, result.data));
  } catch (error) {
    next(error);
  }
};
