const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");
const { Category } = require("./categoryModel");

const SubCategory = sequelize.define(
  "SubCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references : {
        model : Category,
        key : "id",
      },
      onDelete : "CASCADE",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "subcategories",
    timestamps: false,
  }
);

(async () => {
  try {
    await SubCategory.sync({alter : true});
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = { SubCategory };
