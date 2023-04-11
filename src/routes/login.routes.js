import { Router } from 'express';
import { homepage, jwtLogin } from '../controllers/login.controller.js';

const router = Router()

router.get('/', homepage)

router.post('/login', jwtLogin)

export const loginRoutes = router;