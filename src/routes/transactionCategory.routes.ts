import { Router } from 'express';

import {
    getAllTransactionCategories,
    getTransactionCategoryById,
    createTransactionCategory,
    updateTransactionCategory,
    deleteTransactionCategory
} from '../controllers/transactionCategory.controller';

const router = Router()

router.get('/transactionCategories', getAllTransactionCategories)

router.get('/transactionCategory/:id', getTransactionCategoryById)

router.post('/transactionCategory', createTransactionCategory);

router.patch('/transactionCategory/:id', updateTransactionCategory)

router.delete('/transactionCategory/:id', deleteTransactionCategory)

export default router;