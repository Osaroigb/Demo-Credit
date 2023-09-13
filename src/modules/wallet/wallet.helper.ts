import { logger } from '../../utils/logger';
import { BadRequestError } from '../../errors/BadRequestError';

export const validateAmount = (value: number): number => {
  if (value < 0) {
    logger.error('negavite transaction amount is not allowed!');
    throw new BadRequestError('negavite transaction amount is not allowed!');
  }
  
  return value;
};
