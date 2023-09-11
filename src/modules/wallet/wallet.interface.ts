export interface ProcessTransactionParams {
  type: string; 
  amount: number; 
};

export interface ProcessTransferParams {
  type: string; 
  amount: number; 
  receiverEmail: string;
};

export interface ResponseProps {
  message: string;
  data?: { [key: string]: any };
};
 
export interface TransactionObject {
  user_id: number,
  wallet_id: number,
  type: string,
  amount: number,
  description: string
};
