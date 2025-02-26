const {DataTypes} = require("sequelize");
const {sequelize} = require("../database/db");
const {WebsiteDetails} = require("../model/mainProductModel")

const ProductImage = sequelize.define("ProductImage",{
    web_id : {
        type : DataTypes.STRING,
        allowNull : false
    },
    image_url : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            isUrl : true
        }
    },
    public_id : {
        type : DataTypes.STRING,
        allowNull : false, 
    }
},{
    tableName : "product_image",
    timestamps : false,
});

WebsiteDetails.hasMany(ProductImage, {
    foreignKey: 'web_id',
    onDelete: 'CASCADE', 
  });
  
  ProductImage.belongsTo(WebsiteDetails, {
    foreignKey: 'web_id',
  });

(async ()=>{
    try{
        await ProductImage.sync({alter : true});
    }catch(err){
        console.log(err.message);
    }
});

module.exports = {ProductImage};