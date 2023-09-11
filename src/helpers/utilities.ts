import fs from 'fs';
import bcrypt from 'bcrypt';
import config from '../config';
import jwt from 'jsonwebtoken';

export const isObject = (obj: { [key: string]: any } = {}): boolean => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};
  
export const hashString = async (plainText: string, saltRounds = 10): Promise<string> => {
  const hash = await bcrypt.hash(plainText, saltRounds);
  return hash;
};

export const isHashValid = async (plainText: string, hashText: string): Promise<boolean> => {
  const isValid = await bcrypt.compare(plainText, hashText);
  return isValid;
};

export const generateJwt = (payload: { data?: { [key: string]: any }; sub?: string }): { token: string; expiryInSeconds: number } => {
  const privateKeyPath: any = process.env.OAUTH_PRIVATE_KEY || config.get('jwt.privateKey');
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  const expiryInSeconds = Number(process.env.JWT_EXPIRY_IN_SECONDS) || config.get('jwt.expiry');

  const token = jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    audience: config.get('baseUrl'),
    issuer: 'DemoCredit',
    expiresIn: expiryInSeconds
  });

  return { token, expiryInSeconds };
};

export const verifyJwt = (jwtToken: string): string | jwt.JwtPayload => {
  const publicKeyPath: any = process.env.OAUTH_PUBLIC_KEY || config.get('jwt.publicKey');
  const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
  
  const decoded = jwt.verify(jwtToken, publicKey, { audience: config.get('baseUrl'), issuer: 'DemoCredit', algorithms: ['RS256'] });
  return decoded;
};
