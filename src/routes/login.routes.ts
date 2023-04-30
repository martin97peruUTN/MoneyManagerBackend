import { Router } from 'express';
import { homepage, jwtLogin } from '../controllers/login.controller';

const router = Router()

router.get('/', homepage)

router.post('/login', jwtLogin)

export const loginRoutes = router;