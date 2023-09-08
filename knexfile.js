require("dotenv").config()

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.MYSQL_DATABASE_HOST,
      port: process.env.MYSQL_DATABASE_PORT,
      user: process.env.MYSQL_DATABASE_USERNAME,
      password: process.env.MYSQL_DATABASE_PASSWORD,
      database: process.env.MYSQL_DATABASE_NAME,
    },
    pool: {
      min: 1,
      max: 10
    },
    migrations: {
      directory: "./src/database/migrations",
    }
  }
};
