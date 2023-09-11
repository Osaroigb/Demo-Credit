import { logger } from '../../utils/logger';
import { generateJwt, hashString, isHashValid } from '../../helpers/utilities';
import { ConflictError, BadRequestError, UnAuthorizedError } from '../../errors';
import { ResponseProps, ProcessSignupParams, ProcessLoginParams } from './auth.interface';

const db = require("../../database/database.js");

export const processSignup = async (data: ProcessSignupParams): Promise<ResponseProps> => {
  const dbConnection = await db.getConnection();
  const { firstName, lastName, email, password, phoneNumber } = data;

  try {
    // Start a database transaction
    await dbConnection.transaction(async (trx: any) => {
      // Check if the email already exists
      const existingUser = await trx("users").where("email", email);

      if (existingUser.length > 0) {
        logger.error('The Email already exists, please login!');
        throw new ConflictError('The Email already exists, please login!');
      }

      const userPassword = await hashString(password);
      const user = {
        firstName,
        lastName,
        email,
        password: userPassword,
        phoneNumber
      };

      logger.info('new user info');
      logger.info(JSON.stringify(user));

      // Insert the new user into the 'users' table
      await trx("users").insert(user);
      const newUser = await trx("users").where("email", email);

      // Create a wallet for the new user in the 'wallets' table
      await trx("wallets").insert({ user_id: newUser[0].id, balance: 0.00 });
    });

    logger.info('User created successfully!');
    return {
      message: 'Signup successful!',
      data: {
        firstName,
        lastName,
        email,
        phoneNumber
      }
    };
  } catch (error) {
    logger.error('Error creating user:', error);
    throw new BadRequestError(`Error creating user: ${error}`);
  } finally {
    dbConnection.release();
  }
};

export const processLogin = async (data: ProcessLoginParams): Promise<ResponseProps> => {
  const { email, password } = data;
  const dbConnection = await db.getConnection();

  try {
    const user = await dbConnection("users").where("email", email);

    if (user.length === 0) {
      logger.error('Email is incorrect!');
      throw new UnAuthorizedError('Email is incorrect!');
    }

    const isValidPassword = await isHashValid(password, user[0].password as string);

    if (!isValidPassword) {
      logger.error('Password is incorrect!');
      throw new UnAuthorizedError('Password is incorrect!');
    }
    
    const jwt = generateJwt({
      data: {
        user: {
          id: user[0].id,
          firstName: user[0].firstName,
          lastName: user[0].lastName,
          email: user[0].email
        }
      },
      sub: user[0].id.toString()
    });

    return {
      canLogin: true,
      message: 'Login successful!',
      data: {
        auth: {
          type: 'bearer',
          ...jwt
        },
        user: {
          id: user[0].id,
          firstName: user[0].firstName,
          lastName: user[0].lastName,
          email: user[0].email,
          phone: user[0].phone,
          createdAt: user[0].createdAt
        }
      }
    };
  } catch (error) {
    logger.error('Error login user:', error);
    throw new BadRequestError(`Error login user: ${error}`);
  } finally {
    dbConnection.release();
  }
};
