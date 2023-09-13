import { logger } from '../../utils/logger';
import { db } from "../../database/database";
import { validateAmount }  from './wallet.helper';
import { TransactionType, TransactionGroup } from './wallet.constant';
import { BadRequestError, ResourceNotFoundError, UnprocessableEntityError } from '../../errors';
import { ResponseProps, ProcessTransactionParams, TransactionObject, ProcessTransferParams } from './wallet.interface';

export const processDepositFunds = async (data: ProcessTransactionParams, userId: number): Promise<ResponseProps> => {
  let finalBalance: number = 0;
  let userTransaction: TransactionObject = {
    user_id: 0,
    wallet_id: 0,
    type: '',
    amount: 0,
    description: ''
  };

  const { type, amount } = data;
    
  try {
    // Start a database transaction    
    await db.transaction(async (trx: any) => {
      // Check if the user exists
      const user = await trx("users").where("id", userId).first();

      if (!user) {
        logger.error('User account not found!');
        throw new ResourceNotFoundError('User account not found!');
      }

      const userWallet = await trx("wallets").where("user_id", user.id).first();
      const walletBalance = userWallet.balance;

      if (type === TransactionGroup.DEPOSIT) {
        const validatedAmount = validateAmount(Number(amount));
        const newBalance = Number(walletBalance) + validatedAmount;
        finalBalance = newBalance;

        userTransaction = {
          user_id: user.id,
          wallet_id: userWallet.id,
          type: TransactionType.CREDIT,
          amount,
          description: 'User deposit'
        };

        // Update wallet balance of the user and log the transaction
        await trx("wallets").where("user_id", user.id).update({ balance: newBalance, updated_at: new Date() });
        await trx("transactions").insert(userTransaction);
      } else {
        logger.error('Wrong transaction type!');
        throw new BadRequestError('Wrong transaction type!');
      }
    });

    logger.info('Deposit successful!');
    return {
      message: 'Deposit successful!',
      data: {
        ...userTransaction,
        balance: finalBalance,
        date: new Date().toLocaleString()
      }
    };
  } catch (error: any) {
    logger.error('Error depositing funds:', error);
    throw new BadRequestError(`Error depositing funds: ${error}`, error);
  } 
};

export const processWithdrawFunds = async (data: ProcessTransactionParams, userId: number): Promise<ResponseProps> => {
  let finalBalance: number = 0;
  let userTransaction: TransactionObject = {
    user_id: 0,
    wallet_id: 0,
    type: '',
    amount: 0,
    description: ''
  };

  const { type, amount } = data;
      
  try {
    // Start a database transaction
    await db.transaction(async (trx: any) => {
      // Check if the user exists
      const user = await trx("users").where("id", userId).first();
  
      if (!user) {
        logger.error('User account not found!');
        throw new ResourceNotFoundError('User account not found!');
      }
  
      const userWallet = await trx("wallets").where("user_id", user.id).first();
      const walletBalance = userWallet.balance;
  
      if (type === TransactionGroup.WITHDRAW) {

        const validatedAmount = validateAmount(Number(amount));

        if (Number(walletBalance) > validatedAmount) {
          const newBalance = Number(walletBalance) - validatedAmount;
          finalBalance = newBalance;
  
          userTransaction = {
            user_id: user.id,
            wallet_id: userWallet.id,
            type: TransactionType.DEBIT,
            amount,
            description: 'User withdrawal'
          };
  
          // Update wallet balance of the user and log the transaction
          await trx("wallets").where("user_id", user.id).update({ balance: newBalance, updated_at: new Date() });
          await trx("transactions").insert(userTransaction);
        } else {
          logger.error('Unable to process withdrawal due to insufficient funds!');
          throw new UnprocessableEntityError('Unable to process withdrawal due to insufficient funds!');
        }
      } else {
        logger.error('Wrong transaction type!');
        throw new BadRequestError('Wrong transaction type!');
      }
    });
  
    logger.info('Withdrawal successful!');
    return {
      message: 'Withdrawal successful!',
      data: {
        ...userTransaction,
        balance: finalBalance,
        date: new Date().toLocaleString()
      }
    };
  } catch (error: any) {
    logger.error('Error withdrawing funds:', error);
    throw new BadRequestError(`Error withdrawing funds: ${error}`, error);
  }
};

export const processTransferFunds = async (data: ProcessTransferParams, userId: number): Promise<ResponseProps> => {
  let finalBalance: number = 0;
  let senderTransaction: TransactionObject = {
    user_id: 0,
    wallet_id: 0,
    type: '',
    amount: 0,
    description: ''
  };

  const { type, amount, receiverEmail } = data;
      
  try {
    // Start a database transaction
    await db.transaction(async (trx: any) => {
      // Check if the user exists
      const sender = await trx("users").where("id", userId).first();
  
      if (!sender) {
        logger.error('Sender account not found!');
        throw new ResourceNotFoundError('Sender account not found!');
      }
  
      const senderWallet = await trx("wallets").where("user_id", sender.id).first();
      const senderBalance = senderWallet.balance;
  
      if (type === TransactionGroup.TRANSFER) {

        const validatedAmount = validateAmount(Number(amount));

        if (Number(senderBalance) > validatedAmount) {
          const newSenderBalance = Number(senderBalance) - validatedAmount;
          finalBalance = newSenderBalance;

          const receiver = await trx("users").where("email", receiverEmail).first();

          if (!receiver) {
            logger.error('Receiver account not found!');
            throw new ResourceNotFoundError('Receiver account not found!');
          }

          const receiverWallet = await trx("wallets").where("user_id", receiver.id).first();
          const receiverBalance = receiverWallet.balance;
          const newReceiverBalance = Number(receiverBalance) + validatedAmount;

          senderTransaction = {
            user_id: sender.id,
            wallet_id: senderWallet.id,
            type: TransactionType.DEBIT,
            amount,
            description: `Transfer to ${receiver.firstName}`
          };

          const receiverTransaction = {
            user_id: receiver.id,
            wallet_id: receiverWallet.id,
            type: TransactionType.CREDIT,
            amount,
            description: `Transfer from ${sender.firstName}`
          };
  
          // Update wallet balance of the sender and log the transaction
          await trx("wallets").where("user_id", sender.id).update({ balance: newSenderBalance, updated_at: new Date() });
          await trx("transactions").insert(senderTransaction);

          // Update wallet balance of the receiver and log the transaction
          await trx("wallets").where("user_id", receiver.id).update({ balance: newReceiverBalance, updated_at: new Date() });
          await trx("transactions").insert(receiverTransaction);
        } else {
          logger.error('Unable to process transfer due to insufficient funds!');
          throw new UnprocessableEntityError('Unable to process transfer due to insufficient funds!');
        }
      } else {
        logger.error('Wrong transaction type!');
        throw new BadRequestError('Wrong transaction type!');
      }
    });
  
    logger.info('Transfer successful!');
    return {
      message: 'Transfer successful!',
      data: {
        ...senderTransaction,
        balance: finalBalance,
        date: new Date().toLocaleString()
      }
    };
  } catch (error: any) {
    logger.error('Error transferring funds:', error);
    throw new BadRequestError(`Error transferring funds: ${error}`, error);
  }
};

export const processGetTransactions = async (userId: number): Promise<ResponseProps> => {
  try {
    const user = await db("users").where("id", userId).first();

    if (!user) {
      logger.error('User account not found!');
      throw new ResourceNotFoundError('User account not found!');
    }

    // TODO request for wallet_id as path parameter
    const transactions = await db("transactions").where("user_id", user.id);

    if (transactions.length === 0) {
      logger.error("This user hasn't made any transactions!");
      throw new ResourceNotFoundError("This user hasn't made any transactions!");
    }

    logger.info('Transactions retrieved successfully!');
    return {
      message: 'Transactions retrieved successfully!',
      data: transactions
    };
  } catch (error: any) {
    logger.error('Error fetching user transactions:', error);
    throw new BadRequestError(`Error fetching user transactions: ${error}`, error);
  }
};
