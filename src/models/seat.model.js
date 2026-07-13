const { SEAT_STATUS } = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const Seat = sequelize.define('Seat', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    seatCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'seat_categories',
        key: 'id'
      }
    },
    seatNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: SEAT_STATUS.AVAILABLE
    }
  }, {
    tableName: 'seats',
    underscored: true
  });

  return Seat;
};
