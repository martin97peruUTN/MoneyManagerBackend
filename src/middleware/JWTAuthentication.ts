import { Request, Response, NextFunction } from 'express'
import jsonwebtoken from 'jsonwebtoken';
const { verify } = jsonwebtoken;

//import { User } from '../types';
//import { User } from '@prisma/client'

function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return res.status(401).send("token is null")
    }

    if (process.env.TOKEN_SECRET) {
        verify(token, process.env.TOKEN_SECRET, (err, user) => {

            if (err) {
                return res.status(403).send(err.message)
            }
            req.body.user = user
            next()
        })
    } else {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default authenticateToken