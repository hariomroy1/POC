const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize.config.js');

  
    const Organizations = sequelize.define('Organizations', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          address: {
            type: DataTypes.STRING,
          },

      // Add more fields as needed
    },{
      timestamps: false,
    });

  module.exports = Organizations;
