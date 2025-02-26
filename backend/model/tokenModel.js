const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const Token = sequelize.define(
  "Token",
  {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull : false,
      primaryKey : true,
    },
    pr_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pr_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ev_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ev_expiry:{
        type : DataTypes.DATE,
        allowNull: true,
    },
    delete_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    delete_token_expiry :{
        type : DataTypes.DATE,
        allowNull: true,
    },
  },
  {
    tableName: "token",
    timestamps: false,
  }
);

(async () => {
  try {
    await Token.sync({alter : true});
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = { Token };
