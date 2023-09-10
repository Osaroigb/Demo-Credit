import { logger } from '../../utils/logger';
import { ResponseProps, ProcessSignupParams } from './auth.interface';
import { generateJwt, hashString, isHashValid } from '../../helpers/utilities';
import { ConflictError, BadRequestError, UnAuthorizedError } from '../../errors';

const db = require("../../database/database.js");

export const processSignup = async (data: ProcessSignupParams): Promise<ResponseProps> => {
  const { firstName, lastName, email, password, phoneNumber } = data;

  try {
    // Start a database transaction
    await db.transaction(async (trx: any) => {
      // Check if the email already exists
      const existingUser = await trx("users").where("email", email);

      if (existingUser.length > 0) {
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
    db.destroy();
  }
};

export const processLogin = async (email: string, password: string): Promise<ResponseProps> => {
  const user = await db("users").where("email", email);

  if (user.length === 0) {
    throw new UnAuthorizedError('Email is incorrect!');
  }

  const isValidPassword = await isHashValid(password, user[0].password as string);

  if (!isValidPassword) {
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
};
