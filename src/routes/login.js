const express = require('express');
const { jwtLogin, homepage } = require('../controllers/index')

const router = express.Router()

router.get('/', homepage)

router.post('/login', jwtLogin)

module.exports = {
    login: router
}