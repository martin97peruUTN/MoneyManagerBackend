import { Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
const { sign } = jsonwebtoken;
import * as dotenv from 'dotenv';
dotenv.config();

import {
    jwtLoginService
} from '../services/login.service'

export const jwtLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body
    const user = await jwtLoginService(username)

    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (process.env.TOKEN_SECRET) {
        const payload = { userId: user.id, username: user.username, role: user.role };
        const token = sign(payload, process.env.TOKEN_SECRET, { expiresIn: '6h' });
        res.json(token);
    } else {
        res.status(500).json({ message: 'Internal server error' });
    }
}