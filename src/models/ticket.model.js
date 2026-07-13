const { TICKET_STATUS } = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'id'
      }
    },
    seatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'seats',
        key: 'id'
      }
    },
    ticketNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    qrCode: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: TICKET_STATUS.ACTIVE
    }
  }, {
    tableName: 'tickets',
    underscored: true
  });

  return Ticket;
};
