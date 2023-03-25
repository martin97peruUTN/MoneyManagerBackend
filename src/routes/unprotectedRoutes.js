const express = require('express');
//const middleware1 = require('../middleware/middleware1')
const { jwtLogin } = require('../controllers/index')

//const authenticateToken = require('../middleware/JWTAuthentication')

const router = express.Router()

router.post('/login', jwtLogin)

//router.get('/', middleware1, indexController.index)
//router.get('/pruebaToken', authenticateToken, indexController.prueba)

module.exports = {
    unprotectedRoutes: router
}