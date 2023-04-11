import { connectionDB } from '../db.js';

export const index = (req, res) => {
    res.send('Hello World!')
}

export const testToken = (req, res) => {
    res.send(`Test with user: ${req.user.username}`)
}

export const dbtest = async (req, res) => {
	const [result] = await connectionDB.query('SELECT 1 + 1 AS result')
	res.status(200).json(result[0])
}