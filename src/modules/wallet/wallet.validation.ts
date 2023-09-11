import joi from 'joi';
import { validate } from '../../utils/validator';
import { TransactionGroup } from './wallet.constant';
import { BadRequestError } from '../../errors/BadRequestError';

const { object, string, number } = joi.types();

// Custom validation function for transaction amount
const validateAmount = (value: number): number => {
  if (value < 0) {
    throw new BadRequestError('negavite transaction amount is not allowed!');
  }

  return value;
};

const transactionTypeSchema = object.keys({
  type: string.valid(TransactionGroup.DEPOSIT, TransactionGroup.WITHDRAW, TransactionGroup.TRANSFER).trim().required().lowercase(),
});

export const validateTransactionRequestBody = (payload: unknown): { type: string; amount: number } => {
  const schema = transactionTypeSchema.keys({
    amount: number.custom(validateAmount).precision(10).max(9999999999).required()
  });

  return validate(payload, schema);
};

export const validateTransferRequestBody = (payload: unknown): { type: string; amount: number, receiverEmail: string } => {
  const schema = transactionTypeSchema.keys({
    amount: number.custom(validateAmount).precision(10).max(9999999999).required(),
    receiverEmail: string.email().trim().required()
  });

  return validate(payload, schema);
};
