import { Router } from 'express';

import { jwtLogin } from '../controllers/login.controller';

const router = Router()

router.post('/login', jwtLogin)

export const loginRoutes = router;