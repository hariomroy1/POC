const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/sequelize.config.js");

const Step = sequelize.define(
  "Step",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orgId:{ 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id',
      },
    },
    userId:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model : 'users',
        key : 'id',
      }
    },
    stepName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
    },  
  }, 
  {
    tableName: "steps",
    timestamps: false,
  }
);

module.exports = Step;
