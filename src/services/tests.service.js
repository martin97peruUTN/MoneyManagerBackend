import { connectionDB } from '../db.js';

export const indexService = () => {
    return 'Hello World!'
}

export const dbtestService = async () => {
    const [result] = await connectionDB.query('SELECT 1 + 1 AS result')
    console.log(result[0])
    return result[0]
}