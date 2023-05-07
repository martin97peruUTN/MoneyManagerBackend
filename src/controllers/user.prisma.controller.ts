import { Request, Response } from 'express';

import { User } from '@prisma/client'

import {
    getAllUsersService,
    getUserByIdService,
    createUserService,
    updateUserService,
    deleteUserService
} from '../services/user.prisma.service';

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
        const user = await getUserByIdService(+req.params.id)
        if (user === null) {
            res.status(404).send({
                message: 'User not found!'
            })
            return
        }
        res.status(200).json(user)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password, name, lastname } = req.body

        const newUser: any = {
            username: username,
            password: password,
            name: name,
            lastname: lastname
        }

        const user = await createUserService(newUser)
        res.status(200).json(user)
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
        const user = await updateUserService(username, password, name, lastname, +req.params.id)
        if (user === null) {
            return res.status(404).send({
                message: 'User not found!'
            })
        }
        res.status(200).json(user)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await deleteUserService(+req.params.id)
        if (user === null) {
            return res.status(404).send({
                message: 'User not found!'
            })
        }
        res.status(200).json(user)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ message: "Something went wrong" });
    }
}