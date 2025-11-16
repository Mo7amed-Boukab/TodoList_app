const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();


const dbConnection = async () => {

      await mongoose.connect(process.env.DB_URI)
      .then((conn) => {
         console.log(`Database connected successfully : ${conn.connection.host}`)
      })
      .catch((err) => {
        console.error(`Database Error: ${err}`);
      })
     
}

module.exports = dbConnection;