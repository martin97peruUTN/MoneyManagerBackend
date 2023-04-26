import { connectionDB } from '../db.js';

export const getAllUsersService = async () => {
    const [rows] = await connectionDB.query('SELECT * FROM user')
    return rows
}

export const getUserByIdService = async (id) => {
    const [rows] = await connectionDB.query('SELECT * FROM user WHERE id = ?', [id])
    return rows
}

export const createUserService = async (user) => {
    const [rows] = await connectionDB.query('INSERT INTO user SET ?', user)
    return rows.insertId
}

export const updateUserService = async (username, password, name, lastname, id) => {
    const [result] = await connectionDB.query(
        `UPDATE user SET 
            username = IFNULL(?, username), 
            password = IFNULL(?, password), 
            name = IFNULL(?, name), 
            lastname = IFNULL(?, lastname)
            WHERE id = ?`, 
        [username, password, name, lastname, id])
    return result
}

export const deleteUserService = async (id) => {
    const [result] = await connectionDB.query('DELETE FROM user WHERE id = ?', [id])
    return result
}
