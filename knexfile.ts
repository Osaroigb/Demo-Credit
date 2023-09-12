import * as dotenv from 'dotenv';
dotenv.config();

interface KnexConfig {
  [key: string]: object;
}

const knexConfig: KnexConfig = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DEV_DATABASE_HOST,
      port: process.env.DEV_DATABASE_PORT,
      user: process.env.DEV_DATABASE_USERNAME,
      password: process.env.DEV_DATABASE_PASSWORD,
      database: process.env.DEV_DATABASE_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './src/database/migrations',
    },
    seeds: {
      directory: './src/database/seeders',
    },
  },
  test: {
    client: 'mysql2',
    connection: {
      host: process.env.TEST_DATABASE_HOST,
      port: process.env.TEST_DATABASE_PORT,
      user: process.env.TEST_DATABASE_USERNAME,
      password: process.env.TEST_DATABASE_PASSWORD,
      database: process.env.TEST_DATABASE_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './src/database/migrations',
    },
    seeds: {
      directory: './src/database/seeders',
    },
  },
};

export default knexConfig;