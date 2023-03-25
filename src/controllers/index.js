const jwt = require('jsonwebtoken')
require('dotenv').config()

//Unprotected

const users = [
    {
        username: 'martin97peru',
        password: 'prueba123'
    },
    {
        username: 'martin97peru2',
        password: 'prueba456'
    }
];

const jwtLogin = (req, res) => {
    const {username, password} = req.body
    //TODO Buscar en la DB
    const user = users.find((user) => user.username === username)

    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({username, password}, process.env.TOKEN_SECRET, { expiresIn: '6h' });
    res.json(token)
}

//Protected

const index = (req, res) => {
    res.send('Hello World!')
}

const pruebaToken = (req, res) => {
    res.send(`PRUEBA con user: ${req.user.username}`)
}

module.exports = {
    index,
    pruebaToken,
    jwtLogin
}