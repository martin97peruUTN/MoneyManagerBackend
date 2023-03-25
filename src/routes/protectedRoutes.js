const express = require('express');

const indexController = require('../controllers/index')

//const authenticateToken = require('../middleware/JWTAuthentication')

const router = express.Router()

//router.use(authenticateToken)

router.get('/', indexController.index)

router.get('/pruebaToken', indexController.pruebaToken)

module.exports = {
    protectedRoutes: router
}