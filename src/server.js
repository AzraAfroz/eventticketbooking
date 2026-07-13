const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./utils/logger');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server is running in [${process.env.NODE_ENV}] mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to start server: %o', error);
    process.exit(1);
  }
};

startServer();
