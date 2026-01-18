import { Router } from 'express';

import {
    getAllTransactionCategories,
    getTransactionCategoryById,
    createTransactionCategory,
    updateTransactionCategory,
    deleteTransactionCategory
} from '../controllers/transactionCategory.controller';

const router = Router()

/**
 * @swagger
 * /api/transactionCategories:
 *   get:
 *     summary: Get all transaction categories
 *     description: Retrieve all transaction categories available to the authenticated user (public categories + user's private categories)
 *     tags: [Transaction Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transaction categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TransactionCategory'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/transactionCategories', getAllTransactionCategories)

/**
 * @swagger
 * /api/transactionCategory/{id}:
 *   get:
 *     summary: Get transaction category by ID
 *     description: Retrieve a specific transaction category (must be public or owned by authenticated user)
 *     tags: [Transaction Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction category ID
 *     responses:
 *       200:
 *         description: Transaction category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionCategory'
 *       404:
 *         description: Transaction category not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/transactionCategory/:id', getTransactionCategoryById)

/**
 * @swagger
 * /api/transactionCategory:
 *   post:
 *     summary: Create a new transaction category
 *     description: Create a new private transaction category for the authenticated user
 *     tags: [Transaction Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - isExpense
 *             properties:
 *               name:
 *                 type: string
 *                 example: Groceries
 *               isExpense:
 *                 type: boolean
 *                 example: true
 *                 description: true for expense, false for income
 *     responses:
 *       201:
 *         description: Transaction category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionCategory'
 *       400:
 *         description: Bad request (missing or invalid fields)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/transactionCategory', createTransactionCategory);

/**
 * @swagger
 * /api/transactionCategory/{id}:
 *   patch:
 *     summary: Update a transaction category
 *     description: Update a transaction category. Users can only update their own private categories. Admins can update public categories.
 *     tags: [Transaction Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Category Name
 *               isExpense:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Transaction category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionCategory'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden (cannot update public category as non-admin)
 *       404:
 *         description: Transaction category not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch('/transactionCategory/:id', updateTransactionCategory)

/**
 * @swagger
 * /api/transactionCategory/{id}:
 *   delete:
 *     summary: Delete a transaction category
 *     description: Delete a transaction category. Users can only delete their own private categories. Admins can delete public categories.
 *     tags: [Transaction Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction category ID
 *     responses:
 *       200:
 *         description: Transaction category deleted successfully
 *       403:
 *         description: Forbidden (cannot delete public category as non-admin)
 *       404:
 *         description: Transaction category not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/transactionCategory/:id', deleteTransactionCategory)

export default router;