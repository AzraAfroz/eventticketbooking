require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./utils/logger');
const bookingService = require('./services/booking.service');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');

   
    app.listen(PORT, () => {
      logger.info(`Server is running in [${process.env.NODE_ENV}] mode on port ${PORT}`);
      
      // Expire unpaid bookings every 60 seconds
      setInterval(async () => {
        try {
          await bookingService.expireUnpaidBookings();
        } catch (err) {
          logger.error('Error expiring unpaid bookings: %o', err);
        }
      }, 60000);
    });
  } catch (error) {
    logger.error('Unable to start server: %o', error);
    process.exit(1);
  }
};

startServer();
