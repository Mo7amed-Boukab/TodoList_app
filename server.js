const app = require('./app');
const dbConnection = require('./config/database');

const PORT = process.env.PORT || 8000;

dbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}); 