//TODO Delete this file
import { Request, Response } from 'express';

import { UserWithoutId, User } from '../types';
import { toUserWithoutId } from '../utils/user.utils';
import {
    getAllUsersService,
    getUserByIdService,
    createUserService,
    updateUserService,
    deleteUserService
} from '../services/user.mysql2.service';

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        res.status(200).json(await getAllUsersService())
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const rows = await getUserByIdService(+req.params.id) as User[]
        if (rows.length === 0) {
            res.status(404).send({
                message: 'User not found!'
            })
            return
        }
        res.status(200).json(rows[0])
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser: UserWithoutId = toUserWithoutId(req.body)

        const insertId = await createUserService(newUser)
        res.status(200).json(insertId)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { username, password, name, lastname } = req.body
        const affectedRows = await updateUserService(username, password, name, lastname, +req.params.id)
        if (affectedRows === 0) {
            return res.status(404).send({
                message: 'User not found!'
            })
        }
        const rows = await getUserByIdService(+req.params.id)
        res.status(200).json(rows[0])
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const affectedRows = await deleteUserService(Number(req.params.id))
        if (affectedRows === 0) {
            return res.status(404).send({
                message: 'User not found!'
            })
        }
        return res.status(204).json();
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Something went wrong" });
    }
}


//Option 2 de createUser
// export const createUser2 = async (req, res) => {
//     try {
//         const { username, password, name, lastname } = req.body
//         if (!username || !password || !name || !lastname) {
//             res.status(400).send({
//                 message:'Missing data!'
//             })
//             return
//         }
//         const [rows] = await connectionDB.query('INSERT INTO user VALUES (NULL, ?, ?, ?, ?)', [username, password, name, lastname])
//         res.status(200).json(rows.insertId)
//     } catch (error) {
//         return res.status(500).json({ message: "Something went wrong" });
//     }
// }

//UPDATE old code
// export const updateUser = async (req, res) => {
//     let queryString = 'UPDATE user SET';
//     const queryValues = [];

//     if (req.body.username) {
//         queryString += ' username = ?,';
//         queryValues.push(req.body.username);
//     }
//     if (req.body.password) {
//         queryString += ' password = ?,';
//         queryValues.push(req.body.password);
//     }
//     if (req.body.name) {
//         queryString += ' name = ?,';
//         queryValues.push(req.body.name);
//     }
//     if (req.body.lastname) {
//         queryString += ' lastname = ?,';
//         queryValues.push(req.body.lastname);
//     }

//     queryString = queryString.slice(0, -1); // remove the last comma

//     queryString += ' WHERE id = ?';
//     queryValues.push(req.params.id);

//     const [result] = await connectionDB.query(queryString, queryValues)
//     if(result.affectedRows === 0) {
//         res.status(404).send({
//             message: 'User not found!'
//         })
//         return
//     }
//     const [rows] = await connectionDB.query('SELECT * FROM user WHERE id = ?', [req.params.id])
//     res.status(200).json(rows[0])
// }