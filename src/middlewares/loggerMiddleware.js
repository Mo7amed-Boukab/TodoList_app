const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  const now = new Date().toLocaleString();
  logger.info(`${req.method} ${req.originalUrl} - ${now}`);
  next();
};

module.exports = requestLogger;
