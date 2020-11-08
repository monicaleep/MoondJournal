'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class entry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.entry.belongsTo(models.user)
    }
  };
  entry.init({
    text: DataTypes.STRING,
    phase: DataTypes.STRING,
    phaseimg: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    retrograde: DataTypes.BOOLEAN,
    date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'entry',
  });
  return entry;
};
