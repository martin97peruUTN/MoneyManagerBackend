import { Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
const { sign } = jsonwebtoken;
import * as dotenv from 'dotenv';
dotenv.config();

import {
    jwtLoginService,
    homepageService
} from '../services/login.service'

export const jwtLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body
    const user = await jwtLoginService(username)

    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (process.env.TOKEN_SECRET) {
        const token = sign({ username, password }, process.env.TOKEN_SECRET, { expiresIn: '6h' });
        res.json(token)
    } else {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const homepage = (req: Request, res: Response) => {
    res.send(homepageService())
}