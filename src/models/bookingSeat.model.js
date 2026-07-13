module.exports = (sequelize, DataTypes) => {
  const BookingSeat = sequelize.define('BookingSeat', {
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'id'
      },
      primaryKey: true
    },
    seatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'seats',
        key: 'id'
      },
      primaryKey: true
    }
  }, {
    tableName: 'booking_seats',
    underscored: true
  });

  return BookingSeat;
};
