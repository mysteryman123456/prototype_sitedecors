const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const Category = sequelize.define(
  "Category",
  {
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
  },
  {
    tableName: "categories",
    timestamps: false,
  }
);

(async () => {
  try {
    await Category.sync({alter : true});
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = { Category };
