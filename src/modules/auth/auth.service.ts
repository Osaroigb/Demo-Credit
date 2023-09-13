import { logger } from '../../utils/logger';
import { db } from "../../database/database";
import { generateJwt, hashString, isHashValid } from '../../helpers/utilities';
import { ConflictError, BadRequestError, UnAuthorizedError } from '../../errors';
import { ResponseProps, ProcessSignupParams, ProcessLoginParams } from './auth.interface';

export const processSignup = async (data: ProcessSignupParams): Promise<ResponseProps> => {
  const { firstName, lastName, email, password, phoneNumber } = data;

  try {
    // Start a database transaction
    await db.transaction(async (trx: any) => {
      // Check if the email already exists
      const existingUser = await trx("users").where("email", email).first();

      if (existingUser) {
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
      const newUser = await trx("users").where("email", email).first();

      // Create a wallet for the new user in the 'wallets' table
      await trx("wallets").insert({ user_id: newUser.id, balance: 0.00 });
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
  } catch (error: any) {
    logger.error('Error creating user:', error);
    throw new BadRequestError(`Error creating user: ${error}`, error);
  } 
};

export const processLogin = async (data: ProcessLoginParams): Promise<ResponseProps> => {
  const { email, password } = data;

  try {
    const user = await db("users").where("email", email).first();

    if (!user) {
      logger.error('Email is incorrect and doesn\'t exist, please signup!');
      throw new UnAuthorizedError('Email is incorrect and doesn\'t exist, please signup!');
    }

    const isValidPassword = await isHashValid(password, user.password as string);

    if (!isValidPassword) {
      logger.error('Password is incorrect!');
      throw new UnAuthorizedError('Password is incorrect!');
    }
    
    const jwt = generateJwt({
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      },
      sub: user.id.toString()
    });

    logger.info('Login successful!');
    return {
      canLogin: true,
      message: 'Login successful!',
      data: {
        auth: {
          type: 'bearer',
          ...jwt
        },
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt
        }
      }
    };
  } catch (error: any) {
    logger.error('Error login user:', error);
    throw new BadRequestError(`Error login user: ${error}`, error);
  } 
};
