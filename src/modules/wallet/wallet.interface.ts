export interface ProcessTransactionParams {
  type: string; 
  amount: number; 
};

export interface ResponseProps {
  message: string;
  data?: { [key: string]: any };
};
  