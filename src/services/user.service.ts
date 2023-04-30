import { OkPacket, RowDataPacket } from "mysql2"

import { NewUser, User } from '../types.js';
import { connectionDB } from '../db';

export const getAllUsersService = async (): Promise<User[]> => {
    const [rows] = await connectionDB.query('SELECT * FROM user')
    const users = rows as User[]
    return users
}

export const getUserByIdService = async (id: Number): Promise<User[]> => {
    const [rows] = await connectionDB.query('SELECT * FROM user WHERE id = ?', [id])
    const users = rows as User[]
    return users
}

export const createUserService = async (newUser: NewUser): Promise<Number> => {
    const [rows] = await connectionDB.query('INSERT INTO user SET ?', newUser) as OkPacket[]
    return rows.insertId
}

export const updateUserService = async (username: String, password: String, name: String, lastname: String, id: Number): Promise<Number> => {
    const [result] = await connectionDB.query(
        `UPDATE user SET 
            username = IFNULL(?, username), 
            password = IFNULL(?, password), 
            name = IFNULL(?, name), 
            lastname = IFNULL(?, lastname)
            WHERE id = ?`,
        [username, password, name, lastname, id]) as RowDataPacket[]
    const affectedRows: Number = result.affectedRows
    return affectedRows
}

export const deleteUserService = async (id: Number): Promise<Number> => {
    const [result] = await connectionDB.query('DELETE FROM user WHERE id = ?', [id]) as RowDataPacket[]
    const affectedRows: Number = result.affectedRows
    return affectedRows
}
