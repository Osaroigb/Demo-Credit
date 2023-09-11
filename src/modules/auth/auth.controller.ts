import { RequestHandler } from 'express';
import * as authService from './auth.service';
import * as authValidation from './auth.validation';
import { responseHandler } from '../../helpers/response';

export const signup: RequestHandler = async (req, res, next) => {
  try {
    const validData = authValidation.validateSignupRequestBody(req.body);

    const result = await authService.processSignup(validData);
    res.json(responseHandler(result.message, result.data));
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const validData = authValidation.validateLoginRequestBody(req.body);

    const result = await authService.processLogin(validData);
    res.json(responseHandler(result.message, result.data));
  } catch (error) {
    next(error);
  }
};
