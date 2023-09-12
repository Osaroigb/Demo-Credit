import { RequestHandler } from 'express';
import { logger } from '../utils/logger';
import { db } from "../database/database";
import { UnAuthorizedError } from '../errors';
import { verifyJwt } from '../helpers/utilities';

export const authenticateUserJwt: RequestHandler = async (req: any, _res, next) => {

  try {
    const { authorization } = req.headers;

    if (!authorization || typeof authorization !== 'string') {
      throw new UnAuthorizedError('Authorization token is required');
    }

    const [authType, authToken] = req.headers.authorization?.split(' ') || [];

    if (authType !== 'Bearer') {
      throw new UnAuthorizedError('Invalid authorization token');
    }

    try {
      const payload = verifyJwt(authToken);

      if (!payload.sub) {
        throw new UnAuthorizedError('Invalid authorization token');
      }

      const user = await db("users").where("id", +payload.sub).first();

      if (!user) {
        throw new UnAuthorizedError('Invalid authorization token');
      }

      req.user = user;
    } catch (error) {
      logger.error(`[middlewares.authenticate.authenticateUserJwt] => ${error}`);
      throw new UnAuthorizedError('Invalid authorization token');
    }

    next();
  } catch (error) {
    next(error);
  }
};
