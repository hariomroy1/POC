const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize.config.js');

const userRoles = sequelize.define('userRoles', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Roles',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: false,
  // Define indexes to avoid unique constraint on (userId, roleId)
  indexes: [
    {
      unique: false,
      fields: ['userId', 'roleId'],
    },
  ],
});

module.exports = userRoles;

