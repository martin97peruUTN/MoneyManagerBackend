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

router.post('/admin/currency', createCurrency)

router.patch('/admin/currency/:id', updateCurrency)

router.delete('/admin/currency/:id', deleteCurrency)

export default router;