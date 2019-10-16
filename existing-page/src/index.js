const http = require('http');
const app = require('./app');
const debug = require('debug')('app:server');

/**
 * Normalize a port into a number, string, or false.
 *
 * @param {string|number} val
 *
 * @return {number|string|boolean} - named pipe, port number, or false if port
 *         could not be normalized.
 */
function normalizePort(val) {
  let parsedPort;

  if (typeof val === 'string') {
    parsedPort = Number.parseInt(val, 10);

    if (isNaN(parsedPort)) {
      // named pipe
      return val;
    }
  } else {
    parsedPort = val;
  }

  if (parsedPort >= 0) {
    return parsedPort;
  }

  return false;
}

const port = normalizePort(process.env.SERVER_PORT || 4000);
app.set('port', port);

const server = http.createServer(app);

process.on('SIGTERM', () => {
  debug('Performing graceful shutdown of server.');
  server.close();
});

// Listen on provided port, on all network interfaces.
server.listen(port);

/**
 * Event listener for HTTP server "error" event.
 */
server.on('error', error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      debug(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      debug(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', () => {
  const addr = server.address();
  if (addr !== null) {
    const bind =
      typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;

    debug(`Listening on ${bind}`);
  }
});
