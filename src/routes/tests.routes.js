import { Router } from 'express';

import { index, testToken, dbtest } from '../controllers/tests.controller.js';

const tests = Router()

tests.get('/', index)

tests.get('/testToken', testToken)

tests.get('/dbtest2', dbtest)

export default tests;