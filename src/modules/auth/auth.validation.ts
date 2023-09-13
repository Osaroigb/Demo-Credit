import joi from 'joi';
import { validate } from '../../utils/validator';

const { object, string } = joi.types();

const passwordSchema = object.keys({
  password: string.min(5).required()
});

export const validateLoginRequestBody = (payload: unknown): { email: string; password: string } => {
  const schema = passwordSchema.keys({
    email: string.email().trim().required()
  });

  return validate(payload, schema);
};

export const validateSignupRequestBody = (
payload: unknown
): {firstName: string; lastName: string; email: string; password: string; phoneNumber: string} => {
  const schema = passwordSchema.keys({
    firstName: string.min(3).max(20).trim().required(),
    lastName: string.min(3).max(20).trim().required(),
    email: string.email().trim().required(),
    phoneNumber: string.trim().required().pattern(/^(?:\+234|0)[789]\d{9}$/) // Regex pattern for Nigerian phone numbers
  });

  return validate(payload, schema);
};
