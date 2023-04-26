import dotenv from 'dotenv';
dotenv.config();
//con el /promise le digo que use promesas
import { createConnection, createPool } from 'mysql2/promise'

export const connectionDB = createPool(process.env.DATABASE_URL)

// function connectDB(){
//     const connectionDB = createConnection(process.env.DATABASE_URL)
//     console.log('Connected to PlanetScale!')
    
//     const suma = connectionDB.query('SELECT 1 + 1 AS Suma')
//     console.log(suma);//no anda, qsy
// }

// //connection.end()
// export default connectDB