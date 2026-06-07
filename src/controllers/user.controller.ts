import { Request, Response } from 'express';

import {
    getAllUsersService,
    getUserByIdService,
} from '../services/user.service';

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        res.status(200).json(await getAllUsersService())
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await getUserByIdService(req.params.id)
        if (user === null) {
            res.status(404).send({
                message: 'User not found!'
            })
            return
        }
        res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = req.body.user?.userId;
        if (!userId) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        const user = await getUserByIdService(userId)
        if (user === null) {
            return res.status(404).send({
                message: 'User not found!'
            })
        }
        res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}
