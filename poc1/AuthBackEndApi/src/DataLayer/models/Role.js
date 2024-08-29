const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize.config.js');

const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: false,
});

module.exports = Role; 
