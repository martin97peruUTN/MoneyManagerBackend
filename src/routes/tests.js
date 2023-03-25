const express = require('express');

const indexController = require('../controllers/index')

const router = express.Router()

router.get('/api', indexController.index)

router.get('/api/testToken', indexController.testToken)

module.exports = {
    tests: router
}