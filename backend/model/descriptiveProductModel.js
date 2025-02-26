const {DataTypes} = require("sequelize");
const {sequelize} = require("../database/db");
const { WebsiteDetails } = require('../model/mainProductModel');

const DescriptiveDetails = sequelize.define("DescriptiveDetails",{
    web_id : {
        type : DataTypes.STRING,
        allowNull : false
    },
    description : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    technical_description : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    assets : {
        type : DataTypes.JSONB,
        allowNull : false,
    },
    title : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            len : [1 , 50]
        }
    },
    website_url : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            isUrl : true,
        }
    },
    video_url : {
        type : DataTypes.STRING,
        defaultValue :"na",
    }
},{
    sequelize,
    tableName : "descriptive_details",
    timestamps : true,
});

WebsiteDetails.hasOne(DescriptiveDetails, {
    foreignKey: 'web_id',
    onDelete: 'CASCADE', 
  });
  
  DescriptiveDetails.belongsTo(WebsiteDetails, {
    foreignKey: 'web_id',
  });

(async ()=>{
    try{
        await DescriptiveDetails.sync({alter : true})
        console.log(DescriptiveDetails)
    }catch(err){
        console.log(err.message)
    }
})

module.exports = {DescriptiveDetails};