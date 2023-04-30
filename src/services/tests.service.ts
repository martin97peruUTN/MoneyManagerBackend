import { RowDataPacket } from 'mysql2';

import { connectionDB } from '../db';

export const indexService = () => {
    return 'Hello World!'
}

export const dbtestService = async () => {
    const [result] = await connectionDB.query('SELECT 1 + 1 AS result') as RowDataPacket[]
    console.log(result[0])
    return result[0]
}