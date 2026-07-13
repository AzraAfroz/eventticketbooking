module.exports = (sequelize, DataTypes) => {
  const SeatCategory = sequelize.define('SeatCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'seat_categories',
    underscored: true
  });

  return SeatCategory;
};
