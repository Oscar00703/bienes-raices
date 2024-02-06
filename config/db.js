import Sequelize from "sequelize";
import dotenv from 'dotenv'
dotenv.config({path: '.env'})

const db = new Sequelize('bienesraices_node_mvc', process.env.BD_USER,process.env.BD_PASS ?? '',{
    host: process.env.BD_HOST,
    port: 3306,
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire:3000,
        idl:1000
    },
    operatorAliases: false
});

export default db;