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


### Production

This API is deployed to production and available at `http://161.35.172.241:3300`

Ensure you use either Postman's Cloud Agent or Desktop Agent to successfully send HTTP requests 


#### Logging

Sometimes, it's necessary to send logs to the stdout or store them, to do this, make use of the exported [logger](src/utils/logger)

You can log errors based on their levels:

-   error

-   warn

-   info

-   verbose

-   debug

-   silly

Example: `logger.error('You just committed a crime!')`

Ensure you avoid using `console.log` statements anywhere in the code.


#### Environment

Ensure you have eslint and prettier set up on your development environment. Ensure you follow proper linting rules as well. [Here's](https://enlear.academy/integrating-prettier-and-eslint-with-vs-code-1d2f6fb53bc9) a guide on how to setup eslint on vs code


### Contributing
1. To contribute, checkout to the `main` branch (this is the stable branch) first and run `git pull` to sync changes on the repo with what you have locally. 

2. Checkout to your work branch. Your work branch should prefix either `feat_`, `fix_`, `refactor_`, `chore_` along with not more than 6 words description of the task. eg. `feat_update-user-login-response`. Your task should be implemented on this branch

3. Your commits should concisely and accurately state what you worked on. examples are:
- feat: Represents a new feature or enhancement added to the project
- fix: Indicates a bug fix or resolution of an issue
- chore: Refers to routine tasks, maintenance, or general housekeeping
- docs: Represents documentation changes or additions
- style: Indicates changes related to code formatting, styling, or design
- refactor: Indicates code changes that improve the structure or readability of the code
- test: Represents changes or additions related to tests or testing

**NOTE**: Push to the remote repository as frequent as possible at least before calling it a day to avoid possible issues of losing what has been worked on

4. Once done with task, raise a pull request(PR) against the main branch and add me as a reviewer. DO NOT MERGE till it's reviewed

5. After review is done and PR is approved, create another PR against the `staging` branch and merge that. The PR against the main branch should still be open at this point. The essence of merging to the staging branch is for QA before the task goes to production

6. After QA is done and task is approved as ready for production on the staging environment, go ahead and `squash merge` your branch into the `main` branch.

7. Open a PR from the `main` branch against the `production` branch. With the PR title in this format `Deployment to Production - [YYYY-MM-DD]`. eg. `Deployment to production - 2022-01-30`.

8. Inform the dev-ops team to deploy! Hurray you've deployed your task


### Code Standard and Resources
- [Node.js best practices](https://github.com/goldbergyoni/nodebestpractices)

- [Setting up Eslint & Prettier](https://enlear.academy/integrating-prettier-and-eslint-with-vs-code-1d2f6fb53bc9)
