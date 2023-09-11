import { logger } from '../../utils/logger';
import { TransactionType, TransactionGroup } from './wallet.constant';
import { ResponseProps, ProcessTransactionParams, TransactionObject, ProcessTransferParams } from './wallet.interface';
import { BadRequestError, ResourceNotFoundError, UnprocessableEntityError } from '../../errors';

const db = require("../../database/database.js");

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
  const dbConnection = await db.getConnection();
    
  try {
    // Start a database transaction
    await dbConnection.transaction(async (trx: any) => {
      // Check if the user exists
      const user = await trx("users").where("id", userId);

      if (user.length === 0) {
        logger.error('User account not found!');
        throw new ResourceNotFoundError('User account not found!');
      }

      const userWallet = await trx("wallets").where("user_id", user[0].id);
      const walletBalance = userWallet[0].balance;

      if (type === TransactionGroup.DEPOSIT) {
        const newBalance = Number(walletBalance) + Number(amount);
        finalBalance = newBalance;

        userTransaction = {
          user_id: user[0].id,
          wallet_id: userWallet[0].id,
          type: TransactionType.CREDIT,
          amount,
          description: 'User deposit'
        };

        // Update wallet balance of the user and log the transaction
        await trx("wallets").where("user_id", user[0].id).update({ balance: newBalance, updated_at: new Date() });
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
  } catch (error) {
    logger.error('Error depositing funds:', error);
    throw new BadRequestError(`Error depositing funds: ${error}`);
  } finally {
    dbConnection.release();
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
  const dbConnection = await db.getConnection();
      
  try {
    // Start a database transaction
    await dbConnection.transaction(async (trx: any) => {
      // Check if the user exists
      const user = await trx("users").where("id", userId);
  
      if (user.length === 0) {
        logger.error('User account not found!');
        throw new ResourceNotFoundError('User account not found!');
      }
  
      const userWallet = await trx("wallets").where("user_id", user[0].id);
      const walletBalance = userWallet[0].balance;
  
      if (type === TransactionGroup.WITHDRAWAL) {

        if (Number(walletBalance) > Number(amount)) {
          const newBalance = Number(walletBalance) - Number(amount);
          finalBalance = newBalance;
  
          userTransaction = {
            user_id: user[0].id,
            wallet_id: userWallet[0].id,
            type: TransactionType.DEBIT,
            amount,
            description: 'User withdrawal'
          };
  
          // Update wallet balance of the user and log the transaction
          await trx("wallets").where("user_id", user[0].id).update({ balance: newBalance, updated_at: new Date() });
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
  } catch (error) {
    logger.error('Error withdrawing funds:', error);
    throw new BadRequestError(`Error withdrawing funds: ${error}`);
  } finally {
    dbConnection.release();
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
  const dbConnection = await db.getConnection();
      
  try {
    // Start a database transaction
    await dbConnection.transaction(async (trx: any) => {
      // Check if the user exists
      const sender = await trx("users").where("id", userId);
  
      if (sender.length === 0) {
        logger.error('Sender account not found!');
        throw new ResourceNotFoundError('Sender account not found!');
      }
  
      const senderWallet = await trx("wallets").where("user_id", sender[0].id);
      const senderBalance = senderWallet[0].balance;
  
      if (type === TransactionGroup.TRANSFER) {

        if (Number(senderBalance) > Number(amount)) {
          const newSenderBalance = Number(senderBalance) - Number(amount);
          finalBalance = newSenderBalance;

          const receiver = await trx("users").where("email", receiverEmail);

          if (receiver.length === 0) {
            logger.error('Receiver account not found!');
            throw new ResourceNotFoundError('Receiver account not found!');
          }

          const receiverWallet = await trx("wallets").where("user_id", receiver[0].id);
          const receiverBalance = receiverWallet[0].balance;
          const newReceiverBalance = Number(receiverBalance) + Number(amount);

          senderTransaction = {
            user_id: sender[0].id,
            wallet_id: senderWallet[0].id,
            type: TransactionType.DEBIT,
            amount,
            description: `Transfer to ${receiver[0].firstName}`
          };

          const receiverTransaction = {
            user_id: receiver[0].id,
            wallet_id: receiverWallet[0].id,
            type: TransactionType.CREDIT,
            amount,
            description: `Transfer from ${sender[0].firstName}`
          };
  
          // Update wallet balance of the sender and log the transaction
          await trx("wallets").where("user_id", sender[0].id).update({ balance: newSenderBalance, updated_at: new Date() });
          await trx("transactions").insert(senderTransaction);

          // Update wallet balance of the receiver and log the transaction
          await trx("wallets").where("user_id", receiver[0].id).update({ balance: newReceiverBalance, updated_at: new Date() });
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
  } catch (error) {
    logger.error('Error transferring funds:', error);
    throw new BadRequestError(`Error transferring funds: ${error}`);
  } finally {
    dbConnection.release();
  } 
};

export const processGetTransactions = async (userId: number): Promise<ResponseProps> => {
  const dbConnection = await db.getConnection();
    
  try {
    const user = await dbConnection("users").where("id", userId);

    if (user.length === 0) {
      logger.error('User account not found!');
      throw new ResourceNotFoundError('User account not found!');
    }

    const transactions = await dbConnection("transactions").where("user_id", user[0].id);

    if (transactions.length === 0) {
      logger.error("This user hasn't made any transactions!");
      throw new ResourceNotFoundError("This user hasn't made any transactions!");
    }

    logger.info('Transactions retrieved successfully!');
    logger.info(typeof(transactions));
    logger.info(JSON.stringify(transactions));
    logger.info(transactions);
    
    return {
      message: 'Transactions retrieved successfully!',
      data: transactions
    };
  } catch (error) {
    logger.error('Error fetching user transactions:', error);
    throw new BadRequestError(`Error fetching user transactions: ${error}`);
  } finally {
    dbConnection.release();
  }
};
