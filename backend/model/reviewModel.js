const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");
const { WebsiteDetails } = require("../model/mainProductModel");

const Reviews = sequelize.define("Reviews", {
  web_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  review: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [0, 200],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
}, {
  tableName: "reviews",
  timestamps: true,
});

// Relationships
WebsiteDetails.hasMany(Reviews, {
  foreignKey: "web_id",
  onDelete: "CASCADE",
});

Reviews.belongsTo(WebsiteDetails, {
  foreignKey: "web_id",
});


(async () => {
  try {
    await sequelize.sync({alter : true}); 
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = { Reviews };
