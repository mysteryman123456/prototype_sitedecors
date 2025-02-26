const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");
const {WebsiteDetails} = require("./mainProductModel")

const Views = sequelize.define(
  "Views",
  {
    web_id: {
      type: DataTypes.STRING,
      allowNull : false,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull : false
    },
  },
  {
    tableName: "product_views",
    timestamps: false,
  }
);

WebsiteDetails.hasOne(Views, {
  foreignKey: "web_id",
  onDelete: "CASCADE",
});

Views.belongsTo(WebsiteDetails, {
  foreignKey: "web_id",
});


(async () => {
  try {
    await Views.sync({ alter : true });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = { Views };
