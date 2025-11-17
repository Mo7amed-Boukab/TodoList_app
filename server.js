const express = require('express');
const dbConnection = require('./config/database');
require('dotenv').config();

const router = require('./src/routes/route');

const logger = require('./src/utils/logger');
const requestLogger = require('./src/middlewares/loggerMiddleware');
const compression = require('compression');

const PORT = process.env.PORT || 8000;

const app = express();

// Middleware global pour log toutes les requêtes
app.use(requestLogger);

// Middleware pour lire JSON
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Api is running successfully ..');
});

// Middleware for compression HTTP
app.use(compression());

// Routes
app.use('/api/todos', router);

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ success: false, error: err.message });
});

if (process.env.NODE_ENV === 'development') {
  console.log(`mode: ${process.env.NODE_ENV}`);
}

dbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
