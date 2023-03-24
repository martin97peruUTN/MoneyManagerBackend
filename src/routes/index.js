const express = require('express');
const middleware1 = require('../middleware/middleware1.js')
const indexController = require('../controllers/index.js')

const router = express.Router()

router.get('/', middleware1, indexController.index)

router.get('/prueba', indexController.prueba)

module.exports = router