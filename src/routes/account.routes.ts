import { Router } from 'express';

import {
    getAllAccounts,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount
} from '../controllers/account.controller';

const router = Router()

router.get('/accounts', getAllAccounts)

router.get('/account/:id', getAccountById)

router.post('/account', createAccount)

router.patch('/account/:id', updateAccount)

router.delete('/account/:id', deleteAccount)

export default router;