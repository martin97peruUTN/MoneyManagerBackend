import jsonwebtoken from 'jsonwebtoken';
const { sign } = jsonwebtoken;
import * as dotenv from 'dotenv';
dotenv.config();

import {
    jwtLoginService,
    homepageService
} from '../services/login.service.js'

const users = [
    {
        username: 'martin97peru',
        password: 'test123'
    },
    {
        username: 'martin97peru2',
        password: 'test456'
    }
];

export const jwtLogin = (req, res) => {
    const {username, password} = req.body
    const user = jwtLoginService(username)

    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = sign({username, password}, process.env.TOKEN_SECRET, { expiresIn: '6h' });
    res.json(token)
}

export const homepage = (req, res) => {
    res.send(homepageService())
}