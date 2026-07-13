module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'venues',
        key: 'id'
      }
    },
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'organizers',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'published' // published, drafted, cancelled
    }
  }, {
    tableName: 'events',
    underscored: true
  });

  return Event;
};
