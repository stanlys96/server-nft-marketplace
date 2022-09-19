const Pool = require('pg').Pool;
require('dotenv').config();

const devConfig = {
  connectionString: `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE}`,
};

const proConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

module.exports = pool;
