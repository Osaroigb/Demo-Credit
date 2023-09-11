import { logger } from '../../utils/logger';
import { TransactionType } from './wallet.constant';
import { ResponseProps, ProcessTransactionParams } from './wallet.interface';
import { BadRequestError, ResourceNotFoundError, UnprocessableEntityError } from '../../errors';

const db = require("../../database/database.js");

export const processDepositFunds = async (data: ProcessTransactionParams, userId: number): Promise<ResponseProps> => {
  let finalBalance;
  const { type, amount } = data;
    
  try {
    // Start a database transaction
    await db.transaction(async (trx: any) => {
      // Check if the user exists
      const user = await trx("users").where("id", userId);

      if (user.length === 0) {
        throw new ResourceNotFoundError('User not found!');
      }

      const userWallet = await trx("wallets").where("user_id", userId);
      const walletBalance = userWallet[0].balance;

      if (type === TransactionType.DEPOSIT) {
        const newBalance = Number(walletBalance) + Number(amount);
        finalBalance = newBalance;

        const transaction = {
          user_id: user[0].id,
          wallet_id: userWallet[0].id,
          type: TransactionType.DEPOSIT,
          amount
        };

        // Update wallet balance of the user with the newBalance
        await trx("wallets").where("user_id", userId).update({ balance: newBalance, updated_at: new Date() });

        // Store the transaction
        await trx("transactions").insert(transaction);
      } else {
        throw new BadRequestError('Wrong transaction type!');
      }
    });

    logger.info('Deposit successful!');
    return {
      message: 'Deposit successful!',
      data: {
        walletBalance: finalBalance,
        date: new Date().toLocaleString()
      }
    };
  } catch (error) {
    logger.error('Error depositing funds:', error);
    throw new BadRequestError(`Error depositing funds: ${error}`);
  } finally {
    db.destroy();
  } 
};

export const processWithdrawFunds = async (data: ProcessTransactionParams, userId: number): Promise<ResponseProps> => {
  let finalBalance;
  const { type, amount } = data;
      
  try {
    // Start a database transaction
    await db.transaction(async (trx: any) => {
      // Check if the user exists
      const user = await trx("users").where("id", userId);
  
      if (user.length === 0) {
        throw new ResourceNotFoundError('User not found!');
      }
  
      const userWallet = await trx("wallets").where("user_id", userId);
      const walletBalance = userWallet[0].balance;
  
      if (type === TransactionType.WITHDRAWAL) {

        if (Number(walletBalance) > Number(amount)) {
          const newBalance = Number(walletBalance) - Number(amount);
          finalBalance = newBalance;
  
          const transaction = {
            user_id: user[0].id,
            wallet_id: userWallet[0].id,
            type: TransactionType.WITHDRAWAL,
            amount
          };
  
          // Update wallet balance of the user with the newBalance
          await trx("wallets").where("user_id", userId).update({ balance: newBalance, updated_at: new Date() });
  
          // Store the transaction
          await trx("transactions").insert(transaction);
        } else {
          throw new UnprocessableEntityError('Unable to process withdrawal due to insufficient funds!');
        }
      } else {
        throw new BadRequestError('Wrong transaction type!');
      }
    });
  
    logger.info('Withdrawal successful!');
    return {
      message: 'Withdrawal successful!',
      data: {
        walletBalance: finalBalance,
        date: new Date().toLocaleString()
      }
    };
  } catch (error) {
    logger.error('Error depositing funds:', error);
    throw new BadRequestError(`Error depositing funds: ${error}`);
  } finally {
    db.destroy();
  } 
};
