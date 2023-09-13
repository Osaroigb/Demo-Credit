# NexaPay Wallet

NexaPay Wallet is a mobile lending app that has wallet functionality. It is used by borrowers who need a wallet to receive the loans they have been granted and also send the money for repayments.


## Setup

This section will guide you through the setup process required to get up and running with the application.


### Requirements

-   Node (Version >= 18.17.1)

-   NPM (optional yarn) (Version >= 9.6.7)

-   Mysql (Version >= 8.0)

-   TypeScript (`npm install -g typescript` || `yarn global add typescript`)

-   Knex (`npm install -g knex` || `yarn global add knex`)


### Get Started

1. Clone the project from your account repository

2. Run `npm install` or `yarn install` from the root directory of the project

3. Create a `.env` file and copy the content of `.env.example` to it


### Generating Oauth Keys for JWT
1. Run `mkdir ./src/config/keys` to create the keys folder

2. Run `openssl genrsa -out ./src/config/keys/oauth-private.key 2048` to generate an oauth private key

3. Run `openssl rsa -pubout -in ./src/config/keys/oauth-private.key -out ./src/config/keys/oauth-public.key` to generate a corresponding oauth public key

4. Set `"./src/config/keys/oauth-private.key"` as the value of `OAUTH_PRIVATE_KEY` environment variable

5. Set `"./src/config/keys/oauth-public.key"` as the value of `OAUTH_PUBLIC_KEY` environment variable


### Database Setup

1. Create a new database in mysql 

2. Fill the `.env` file you created with the database credentials

3. Run `npm run migrate:dev` to run the migrations and create the tables in the development database

4. Run `npm run migrate:test` to run the migrations and create the tables in the test database

5. Run `npm run migrate:undo` to undo the migrations and drop the tables

6. You can run `npm run make:migration` to create migration files, e.g `npm run make:migration create_users_table`. This is an optional step since all the migration files you need are already available

7. Run `npm run seed` to populate a test user in the test database

8. You can find the E-R Diagram of the database here `https://dbdesigner.page.link/hC8x9k5cKSLE6ZpC7`


### Development

To run the application, use the command: `npm run start`

Use `development` as your node environment

It is important to set up environment variables for the system to function properly
