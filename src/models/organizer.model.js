module.exports = (sequelize, DataTypes) => {
  const Organizer = sequelize.define('Organizer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'organizers',
    underscored: true
  });

  return Organizer;
};
