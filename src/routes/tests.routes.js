import { Router } from 'express';

import { index, dbtest } from '../controllers/tests.controller.js';

const tests = Router()

tests.get('/index', index)

tests.get('/dbtest', dbtest)

export default tests;