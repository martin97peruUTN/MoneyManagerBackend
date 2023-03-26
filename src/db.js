require('dotenv').config()
import { createConnection } from 'mysql2'

function connectDB(){
    const connectionDB = createConnection(process.env.DATABASE_URL)
    console.log('Connected to PlanetScale!')
    
    const suma = connectionDB.query('SELECT 1 + 1 AS Suma')
    console.log(suma);//no anda, qsy
}

//connection.end()
export default connectDB