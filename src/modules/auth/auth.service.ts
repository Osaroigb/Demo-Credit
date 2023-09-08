import { logger } from '../../utils/logger';
import { accountNumberGenerator } from './auth.helper';
import { ResponseProps, ProcessSignupParams } from './auth.interface';
import { generateJwt, hashString, isHashValid } from '../../helpers/utilities';
import { ConflictError, BadRequestError, UnAuthorizedError } from '../../errors';

const db = require("../../database/database.js");

export const processSignup = async (data: ProcessSignupParams): Promise<ResponseProps> => {
  const { firstName, lastName, email, password, phoneNumber } = data;
  const existingUser = await db("users").where("email", email);

  if (existingUser.length > 0) {
    throw new ConflictError('The Email already exists, please login!');
  }

  const userPassword = await hashString(password);
  const accountNumber = await accountNumberGenerator();

  const newUser = {
    firstName,
    lastName,
    email,
    password: userPassword,
    phoneNumber,
    accountNumber
  };

  logger.info('new user info');
  logger.info(JSON.stringify(newUser));
  
  await db("users").insert(newUser).then(() => {
    logger.info('User created successfully!');
  })
  .catch((error: any) => {
    logger.error('Error creating user:', error);
    throw new BadRequestError(error);
  })
  .finally(() => {
    db.destroy(); // ensure the knex connection is closed
  });

  return {
    message: 'Signup successful!',
    data: {
      firstName,
      lastName,
      email,
      phoneNumber,
      accountNumber
    }
  };
};

export const processLogin = async (email: string, password: string): Promise<ResponseProps> => {
  const user = await db("users").where("email", email);

  if (user.length === 0) {
    throw new UnAuthorizedError('Email is incorrect!');
  }

  const isValidPassword = await isHashValid(password, user.password as string);

  if (!isValidPassword) {
    throw new UnAuthorizedError('Password is incorrect!');
  }
  
  // await userRepo.update({ lastLoginAt: new Date() }, { where: { id: user.id } }); // TODO: update users table

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
        accountNumber: user.accountNumber,
        createdAt: user.createdAt
      }
    }
  };
};
