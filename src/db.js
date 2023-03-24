require('dotenv').config()
const mysql = require('mysql2')

function connectDB(){
    const connectionDB = mysql.createConnection(process.env.DATABASE_URL)
    console.log('Connected to PlanetScale!')
    
    const suma = connectionDB.query('SELECT 1 + 1 AS Suma')
    console.log(suma);//no anda, qsy
}

//connection.end()
module.exports = connectDB