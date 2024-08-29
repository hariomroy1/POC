const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/sequelize.config.js");

const Form = sequelize.define(
  "Form",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:false,
    },
    cityName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:false,
    }, 
  }, 
  {
    tableName: "forms",
    timestamps: false,
  }
);

module.exports = Form;
