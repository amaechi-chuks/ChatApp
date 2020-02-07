const winston = require('winston');
const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({ 
          level: 'debug',
          json: true,
          handleExceptions: true
         }),
      new winston.transports.File({
        level: 'debug',
        filename: './chatAppErrorLog.log',
        handleExceptions: true
      })
    ],
    exitOnError: false,
  });
module.exports = logger;