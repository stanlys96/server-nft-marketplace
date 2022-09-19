let env = process.env.NODE_ENV;

if (env != 'production') {
  require('dotenv').config();
}

module.exports = {
  production: {
    use_env_variable: 'DATABASE_URL',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
