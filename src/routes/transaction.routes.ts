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

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     description: Retrieve all transactions for the authenticated user, optionally filtered by date range
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD). Defaults to first day of current month
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD). Defaults to last day of current month
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request (invalid date range)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/transactions', getAllTransactions)

/**
 * @swagger
 * /api/transactions/expenses:
 *   get:
 *     summary: Get all expense transactions
 *     description: Retrieve all expense transactions for the authenticated user, optionally filtered by date range
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD). Defaults to first day of current month
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD). Defaults to last day of current month
 *     responses:
 *       200:
 *         description: List of expense transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request (invalid date range)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/transactions/expenses', getAllTransactionsExpenses)

/**
 * @swagger
 * /api/transactions/incomes:
 *   get:
 *     summary: Get all income transactions
 *     description: Retrieve all income transactions for the authenticated user, optionally filtered by date range
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD). Defaults to first day of current month
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD). Defaults to last day of current month
 *     responses:
 *       200:
 *         description: List of income transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request (invalid date range)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/transactions/incomes', getAllTransactionsIncomes)

/**
 * @swagger
 * /api/transaction/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     description: Retrieve a specific transaction by its ID (must belong to authenticated user)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/transaction/:id', getTransactionById)

/**
 * @swagger
 * /api/transaction:
 *   post:
 *     summary: Create a new transaction
 *     description: Create a new transaction. Account balance will be automatically updated based on transaction type (expense/income)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - accountId
 *               - transactionCategoryId
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 100.00
 *                 description: Transaction amount (must be greater than 0)
 *               comment:
 *                 type: string
 *                 nullable: true
 *                 example: Grocery shopping
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: '2024-01-15T10:30:00Z'
 *                 description: Transaction date (defaults to current date if not provided)
 *               accountId:
 *                 type: integer
 *                 example: 1
 *                 description: Account ID (must belong to authenticated user)
 *               transactionCategoryId:
 *                 type: integer
 *                 example: 1
 *                 description: Transaction category ID (must be public or owned by user)
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *                 accountUpdated:
 *                   $ref: '#/components/schemas/Account'
 *       400:
 *         description: Bad request (missing or invalid fields)
 *       404:
 *         description: Account or transaction category not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/transaction', createTransaction);

/**
 * @swagger
 * /api/transaction/{id}:
 *   patch:
 *     summary: Update a transaction
 *     description: Update an existing transaction. Account balances will be automatically adjusted
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 150.00
 *               comment:
 *                 type: string
 *                 nullable: true
 *                 example: Updated comment
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: '2024-01-16T10:30:00Z'
 *               accountId:
 *                 type: integer
 *                 example: 1
 *               transactionCategoryId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *                 accountUpdated:
 *                   $ref: '#/components/schemas/Account'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Transaction, account, or category not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch('/transaction/:id', updateTransaction)

/**
 * @swagger
 * /api/transaction/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     description: Delete a transaction. Account balance will be automatically adjusted
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *                 accountUpdated:
 *                   $ref: '#/components/schemas/Account'
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/transaction/:id', deleteTransaction)

export default router;