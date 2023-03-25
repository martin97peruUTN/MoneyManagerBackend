const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null){
        return res.status(401).send("token is null")
    } 

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        
        if (err){
            console.log(err.message)
            return res.status(403).send(err.message)
        } 

        req.user = user

        next()
    })
}

module.exports = authenticateToken