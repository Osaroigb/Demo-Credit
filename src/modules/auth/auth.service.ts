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
    throw new BadRequestError(`Error creating user: ${error}`);
  })
  .finally(() => {
    db.destroy();
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
        accountNumber: user[0].accountNumber,
        createdAt: user[0].createdAt
      }
    }
  };
};
