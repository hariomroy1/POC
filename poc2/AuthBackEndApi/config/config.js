// Load environment variables from .env file
require('dotenv').config();

//configure file for development phase
const development = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'mysql',
};

module.exports = { development };
