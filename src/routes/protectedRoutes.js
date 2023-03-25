const express = require('express');

const middleware1 = require('../middleware/middleware1')

const indexController = require('../controllers/index')

//const authenticateToken = require('../middleware/JWTAuthentication')

const router = express.Router()

//router.use(authenticateToken)

router.get('/', middleware1, indexController.index)

router.get('/pruebaToken', indexController.pruebaToken)

module.exports = {
    protectedRoutes: router
}