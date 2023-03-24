import express from 'express';
import middleware1 from '../middleware/middleware1.js'
import indexController from '../controllers/index.js';

const router = express.Router()

router.get('/', middleware1, indexController.index)

router.get('/prueba', indexController.prueba)

export default router