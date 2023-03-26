import { Router } from 'express';
import { homepage, jwtLogin } from '../controllers/index.js';

const router = Router()

router.get('/', homepage)

router.post('/login', jwtLogin)

export const login = router;