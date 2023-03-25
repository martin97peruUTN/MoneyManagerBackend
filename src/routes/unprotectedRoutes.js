const express = require('express');
const { jwtLogin } = require('../controllers/index')

const router = express.Router()

router.post('/login', jwtLogin)

module.exports = {
    unprotectedRoutes: router
}