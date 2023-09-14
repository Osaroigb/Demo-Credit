const app = require('./app');
const http = require('http');
const config = require('./config');
const stoppable = require('stoppable');

// import app from './app';
// import http from 'http';
// import config from './config';
// import stoppable from 'stoppable';

import { gracefulShutdown, handleError, normalizePort, onListening } from './helpers/server';

const port = Number(process.env.APP_PORT) || config.get('port') || normalizePort(3000);
app.set('port', port);

/**
 * Create HTTP server
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces
 */
server.listen(port);
server.on('error', (error: any) => handleError(error, port));
server.on('listening', () => onListening(server));

// quit on ctrl+c
process.on('SIGINT', () => gracefulShutdown(stoppable(server), 'Got SIGINT. Graceful shutdown'));

// quit properly
process.on('SIGTERM', () => gracefulShutdown(stoppable(server), 'Got SIGTERM. Graceful shutdown'));
