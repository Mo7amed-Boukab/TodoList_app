const express = require('express');
const compression = require('compression');
const cors = require('cors');
const todoRoutes = require('./src/routes/todoRoutes');
const authRoutes = require('./src/routes/authRoutes');
const requestLogger = require('./src/middlewares/loggerMiddleware');
const logger = require('./src/utils/logger');
const { monitoringMiddleware, client } = require('./src/middlewares/monitoringMiddleware');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

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

module.exports = app;
