const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'NexaPay Wallet',
      version: '1.0.0',
      description: 'Documentation for NexaPay Wallet API',
    },
    servers: [
      {
        url: process.env.APP_URL,
        description: '',
      },
    ],
  },
  apis: ['./src/modules/auth/auth.route.ts', './src/modules/wallet/wallet.route.ts'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
