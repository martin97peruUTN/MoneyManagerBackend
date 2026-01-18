import { Router } from 'express';

import {
    getAllAccounts,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount
} from '../controllers/account.controller';

const router = Router()

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Get all accounts
 *     description: Retrieve all accounts for the authenticated user
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/accounts', getAllAccounts)

/**
 * @swagger
 * /api/account/{id}:
 *   get:
 *     summary: Get account by ID
 *     description: Retrieve a specific account by its ID (must belong to authenticated user)
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Account details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       404:
 *         description: Account not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/account/:id', getAccountById)

/**
 * @swagger
 * /api/account:
 *   post:
 *     summary: Create a new account
 *     description: Create a new account for the authenticated user
 *     tags: [Accounts]
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
 *               - currencyId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Savings Account
 *               balance:
 *                 type: number
 *                 format: float
 *                 default: 0
 *                 example: 0
 *               currencyId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       400:
 *         description: Bad request (missing or invalid fields)
 *       404:
 *         description: Currency not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/account', createAccount)

/**
 * @swagger
 * /api/account/{id}:
 *   patch:
 *     summary: Update an account
 *     description: Update an existing account (must belong to authenticated user)
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Account Name
 *               balance:
 *                 type: number
 *                 format: float
 *                 example: 2000.00
 *               currencyId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Account or currency not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch('/account/:id', updateAccount)

/**
 * @swagger
 * /api/account/{id}:
 *   delete:
 *     summary: Delete an account
 *     description: Delete an account (must belong to authenticated user)
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       404:
 *         description: Account not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/account/:id', deleteAccount)

export default router;