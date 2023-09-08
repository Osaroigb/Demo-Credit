import { Response } from 'express';
// import { logger } from '../utils/logger';
import DomainError from '../errors/DomainError';

export const handleError = (error: Error, responseStream?: Response): void | Response => {
  
  // if (error instanceof ValidationError) {
  //   logger.error('[Database Validation Error] => ', error);
  // } else {
  //   logger.error('[Unhandled Error] => ', error);
  // }

  if (responseStream) {
    if (error instanceof DomainError) {
      return responseStream.status(error.getHttpCode()).send({
        success: error.getStatus(),
        message: error.message,
        data: error.getData ? error.getData() || {} : {}
      });
    }

    return responseStream.status(500).send({
      success: false,
      message: 'Something went wrong, please try again. Reach out to us if issue persists',
      data: {}
    });
  }

  throw error;
};
