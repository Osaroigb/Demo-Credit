import joi from 'joi';
import { BadRequestError } from '../errors';

export const validate = <T>(payload: { [key: string]: any } | unknown, schema: joi.ObjectSchema<any>): T => {
  const { value, error } = schema.validate(payload, { abortEarly: false });

  if (error) {
    const errorDetails = error.details;

    const formattedErrorDetails = errorDetails.map((errorDetail) => ({
      details: errorDetail.message.replace(/(["'])(?:(?=(\\?))\2.)*?\1/, 'This field'),
      path: errorDetail.path.join('.')
    }));

    throw new BadRequestError('Invalid request data', undefined, formattedErrorDetails);
  }
  return value;
};
