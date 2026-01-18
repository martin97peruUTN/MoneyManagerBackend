import { Router } from 'express';

import {
    getAllCurrencies,
    getCurrencyById,
    createCurrency,
    updateCurrency,
    deleteCurrency
} from '../controllers/currency.controller';

const router = Router()

/**
 * @swagger
 * /api/currencies:
 *   get:
 *     summary: Get all currencies
 *     description: Retrieve all available currencies (public endpoint, requires authentication)
 *     tags: [Currencies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of currencies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Currency'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/currencies', getAllCurrencies)

/**
 * @swagger
 * /api/currency/{id}:
 *   get:
 *     summary: Get currency by ID
 *     description: Retrieve a specific currency by its ID
 *     tags: [Currencies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Currency ID
 *     responses:
 *       200:
 *         description: Currency details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 *       404:
 *         description: Currency not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/currency/:id', getCurrencyById)

/**
 * @swagger
 * /api/admin/currency:
 *   post:
 *     summary: Create a new currency (Admin only)
 *     description: Create a new currency. Only administrators can perform this action
 *     tags: [Currencies, Admin]
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
 *               - symbol
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *                 example: US Dollar
 *               symbol:
 *                 type: string
 *                 example: $
 *               code:
 *                 type: string
 *                 example: USD
 *     responses:
 *       201:
 *         description: Currency created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 *       400:
 *         description: Bad request (missing or invalid fields)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 *       500:
 *         description: Internal server error
 */
router.post('/admin/currency', createCurrency)

/**
 * @swagger
 * /api/admin/currency/{id}:
 *   patch:
 *     summary: Update a currency (Admin only)
 *     description: Update an existing currency. Only administrators can perform this action
 *     tags: [Currencies, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Currency ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: US Dollar
 *               symbol:
 *                 type: string
 *                 example: $
 *               code:
 *                 type: string
 *                 example: USD
 *     responses:
 *       200:
 *         description: Currency updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Currency not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 *       500:
 *         description: Internal server error
 */
router.patch('/admin/currency/:id', updateCurrency)

/**
 * @swagger
 * /api/admin/currency/{id}:
 *   delete:
 *     summary: Delete a currency (Admin only)
 *     description: Delete a currency. Only administrators can perform this action
 *     tags: [Currencies, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Currency ID
 *     responses:
 *       200:
 *         description: Currency deleted successfully
 *       404:
 *         description: Currency not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 *       500:
 *         description: Internal server error
 */
router.delete('/admin/currency/:id', deleteCurrency)

export default router;