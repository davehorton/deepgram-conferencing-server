const pino = require('pino');

module.exports = pino({
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  logging: {level: process.env.DEEPGRAM_LOGLEVEL || 'info'}
});
