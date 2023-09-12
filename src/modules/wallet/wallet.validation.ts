import joi from 'joi';
import { validate } from '../../utils/validator';
import { validateAmount }  from './wallet.helper';
import { TransactionGroup } from './wallet.constant';

const { object, string, number } = joi.types();

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
