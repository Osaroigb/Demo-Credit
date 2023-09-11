export interface User {
  [key:string]: any
};

export  interface ResponseProps {
  canLogin?: boolean;
  message: string;
  data?: { [key: string]: any };
};

export interface ProcessSignupParams {
  firstName: string; 
  lastName: string; 
  email: string; 
  password: string;
  phoneNumber: string; 
};

export interface ProcessLoginParams {
  email: string; 
  password: string;
};
