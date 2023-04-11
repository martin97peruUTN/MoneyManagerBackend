import { connectionDB } from '../db.js';

export const getAllUsers = async (req, res) => {
	const [result] = await connectionDB.query('SELECT * FROM user')
	res.status(200).json(result)
}

export const getUserById = async (req, res) => {
    const [result] = await connectionDB.query('SELECT * FROM user WHERE id = ?', [req.params.id])
    res.status(200).json(result[0])
}

//Option 1
export const createUser = async (req, res) => {
    const { username, password, name, lastname } = req.body
    if (!username || !password || !name || !lastname) {
        res.status(400).send('Missing data!')
        return
    }
	const [result] = await connectionDB.query('INSERT INTO user SET ?', req.body)
	res.status(200).json(result.insertId)
}

//Option 2
export const createUser2 = async (req, res) => {
    const { username, password, name, lastname } = req.body
    if (!username || !password || !name || !lastname) {
        res.status(400).send('Missing data!')
        return
    }
	const [result] = await connectionDB.query('INSERT INTO user VALUES (NULL, ?, ?, ?, ?)', [username, password, name, lastname])
	res.status(200).json(result.insertId)
}

export const updateUser = async (req, res) => {
    let queryString = 'UPDATE user SET';
    const queryValues = [];

    if (req.body.username) {
        queryString += ' username = ?,';
        queryValues.push(req.body.username);
    }
    if (req.body.password) {
        queryString += ' password = ?,';
        queryValues.push(req.body.password);
    }
    if (req.body.name) {
        queryString += ' name = ?,';
        queryValues.push(req.body.name);
    }
    if (req.body.lastname) {
        queryString += ' lastname = ?,';
        queryValues.push(req.body.lastname);
    }

    queryString = queryString.slice(0, -1); // remove the last comma

    queryString += ' WHERE id = ?';
    queryValues.push(req.params.id);

    const [result] = await connectionDB.query(queryString, queryValues)
    res.status(200).json(result)
}

export const deleteUser = async (req, res) => {
    const [result] = await connectionDB.query('DELETE FROM user WHERE id = ?', [req.params.id])
    if(result.affectedRows === 0) {
        res.status(404).send('User not found!')
        return
    }
    res.status(200).json(result)
}