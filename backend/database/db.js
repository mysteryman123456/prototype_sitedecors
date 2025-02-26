const {Sequelize} = require("sequelize")
require("dotenv").config()

const sequelize = new Sequelize("sitedecors","postgres",process.env.DATABASE_PASSWORD,{ // database , username , password
    host : "localhost",
    dialect: "postgres"
})
const connection = async ()=>{
    try {
        await sequelize.authenticate()
    } catch (error) {
        console.log("An error occured")
    }
}

module.exports = {sequelize , connection}