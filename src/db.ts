import dotenv from 'dotenv';
dotenv.config();
//con el /promise le digo que use promesas
import { Pool, createConnection, createPool } from 'mysql2/promise'

let connectionDBPool: Pool

if(process.env.DATABASE_URL){
    connectionDBPool = createPool(process.env.DATABASE_URL)
}else{
    throw new Error('Database URL not found')
}

export const connectionDB = connectionDBPool

// function connectDB(){
//     const connectionDB = createConnection(process.env.DATABASE_URL)
//     console.log('Connected to PlanetScale!')
    
//     const suma = connectionDB.query('SELECT 1 + 1 AS Suma')
//     console.log(suma);//no anda, qsy
// }

// //connection.end()
// export default connectDB