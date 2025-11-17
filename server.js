const express = require('express');
const dbConnection = require('./config/database');
require('dotenv').config();

const router = require('./src/routes/route');

const logger = require('./src/utils/logger');
const requestLogger = require('./src/middlewares/loggerMiddleware');
const compression = require('compression');
const { monitoringMiddleware, client } = require('./src/middlewares/monitoringMiddleware');

const PORT = process.env.PORT || 8000;
const app = express();

// Middleware pour lire JSON
app.use(express.json());

// Middleware for compression HTTP
app.use(compression());

// Middleware global pour log toutes les requêtes
app.use(requestLogger);

// Middleware global pour monitorer chaque requête
app.use((req, res, next) => {
  if (req.path === '/metrics') return next(); // exclure le monitoring du endpoint /metrics
  monitoringMiddleware(req, res, next);
});


// Route de test
app.get('/', (req, res) => {
  res.send('Api is running successfully ..');
});

// Routes
app.use('/api/todos', router);

// Endpoint pour récupérer toutes les métriques
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

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
