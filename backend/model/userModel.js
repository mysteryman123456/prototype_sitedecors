const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");
const { WebsiteDetails } = require('../model/mainProductModel');

const Users = sequelize.define(
  "Users",  
  {
    userId : {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate : {
        isEmail : true,
      }
    },
    phonenumber: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    profileImage : {
      type : DataTypes.STRING,
      allowNull : true,
    },
    password: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    googleLogin : {
      allowNull : true,
      defaultValue : false,
      type : DataTypes.BOOLEAN
    },
    verified : {
      allowNull : true,
      defaultValue : false,
      type : DataTypes.BOOLEAN
    }
  },
  {
    sequelize,
    tableName: "users",  
    timestamps: true,
  }
);

(async () => {
  try {
    await Users.sync({alter : true});  
  } catch (err) {
    console.error('Error syncing Users model:', err.message);
  }
});


WebsiteDetails.belongsTo(Users, { 
  foreignKey: "seller_email", 
  targetKey: "email",         
});

Users.hasMany(WebsiteDetails, {
  foreignKey: "seller_email",
});


module.exports = { Users };