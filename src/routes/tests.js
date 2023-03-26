import { Router } from 'express';

import { index, testToken } from '../controllers/index.js';

const router = Router()

router.get('/api', index)

router.get('/api/testToken', testToken)

export const tests = router;