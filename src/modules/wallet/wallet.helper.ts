import { BadRequestError } from '../../errors/BadRequestError';

export const validateAmount = (value: number): number => {
  if (value < 0) {
    throw new BadRequestError('negavite transaction amount is not allowed!');
  }
  
  return value;
};
