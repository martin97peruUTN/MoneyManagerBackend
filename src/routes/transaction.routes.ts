import { Router } from 'express';

import {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getAllTransactionsExpenses,
    getAllTransactionsIncomes
} from '../controllers/transaction.controller';

const router = Router()

router.get('/transactions', getAllTransactions)

router.get('/transactions/expenses', getAllTransactionsExpenses)

router.get('/transactions/incomes', getAllTransactionsIncomes)

router.get('/transaction/:id', getTransactionById)

router.post('/transaction', createTransaction);

router.patch('/transaction/:id', updateTransaction)

router.delete('/transaction/:id', deleteTransaction)

export default router;