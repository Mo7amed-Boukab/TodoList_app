const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('Database Error:', err);
    process.exit(1);
  }
};

module.exports = dbConnection;
