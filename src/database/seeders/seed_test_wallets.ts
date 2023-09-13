import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("wallets").del();

  // Inserts seed entries
  await knex("wallets").insert([ 
    { 
      id: 1, 
      user_id: 1, 
      balance: 400.00 
    },
    { 
      id: 2, 
      user_id: 2, 
      balance: 0.00 
    }
  ]);
};
