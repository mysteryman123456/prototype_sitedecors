const {DataTypes} = require("sequelize")
const {sequelize} = require("../database/db")

const WebsiteDetails = sequelize.define("WebsiteDetails",{
    web_id : {
        type : DataTypes.STRING,
        primaryKey : true,
    },
    category_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    subcategory_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    price : {
        type : DataTypes.INTEGER,
        allowNull : false, 
        validate : {
            min : 1,
            max : 1000000,
        }
    },
    funds : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,
    },
    co_founder : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,
    },
    negotiable : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,
    },
    undisclosed : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,
    },
    verified : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,
    },
    seller_email :{
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            isEmail : true,
        }
    }
},{
    tableName : "website_details",
    timestamps : true,
});

(async ()=>{
    try{
        await WebsiteDetails.sync({alter : true})
    }catch(err){
        console.log(err.message)
    }
});


module.exports = {WebsiteDetails};