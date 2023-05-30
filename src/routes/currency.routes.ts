import { Router } from 'express';

import {
    getAllCurrencies,
    getCurrencyById,
    createCurrency,
    updateCurrency,
    deleteCurrency
} from '../controllers/currency.controller';

const router = Router()

router.get('/currencies', getAllCurrencies)

router.get('/currency/:id', getCurrencyById)

router.post('/currency', createCurrency)

router.patch('/currency/:id', updateCurrency)

router.delete('/currency/:id', deleteCurrency)

export default router;