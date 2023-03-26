import jsonwebtoken from 'jsonwebtoken';
const { sign } = jsonwebtoken;
import * as dotenv from 'dotenv';
dotenv.config();

//Unprotected

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
    //TODO Search on DB
    const user = users.find((user) => user.username === username)

    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = sign({username, password}, process.env.TOKEN_SECRET, { expiresIn: '6h' });
    res.json(token)
}

//Protected

export const index = (req, res) => {
    res.send('Hello World!')
}

export const testToken = (req, res) => {
    res.send(`Test with user: ${req.user.username}`)
}

export const homepage = (req, res) => {
    res.send("Homepage")
}