import { RequestHandler } from 'express';
import { logger } from '../utils/logger';
import { UnAuthorizedError } from '../errors';
import { verifyJwt } from '../helpers/utilities';

export const authenticateUserJwt: RequestHandler = async (req: any, _res, next) => {

  try {
    const { authorization } = req.headers;
    const db = require("../database/database.js");
    const dbConnection = await db.getConnection();

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

      const user = await dbConnection("users").where("id", +payload.sub);

      if (user.length === 0) {
        throw new UnAuthorizedError('Invalid authorization token');
      }

      req.user = user[0];
    } catch (error) {
      logger.error(`[middlewares.authenticate.authenticateUserJwt] => ${error}`);
      throw new UnAuthorizedError('Invalid authorization token');
    } finally {
      dbConnection.release();
      next();
    }
  } catch (error) {
    next(error);
  }
};
