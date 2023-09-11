/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('transactions', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
    table.integer('wallet_id').unsigned().notNullable().references('id').inTable('wallets');
    table.enu('type', ['credit', 'debit']).notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.string("description").notNullable();
    table.timestamp('transaction_time').defaultTo(knex.fn.now()); 
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("transactions");
};
