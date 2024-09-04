const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/sequelize.config.js");

const Auth = sequelize.define(
  "Auth",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true, 
    },
    orgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id',
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'username',  // Match the reference column in users table
      },
    },
    stepName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "auth",
    timestamps: false,
  }
);

module.exports = Auth;
