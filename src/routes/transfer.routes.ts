import { Router } from 'express';

import {
    getAllTransfersByUser,
    getAllOriginTransfersByUser,
    getAllDestinyTransfersByUser,
    getAllTransfersByAccountId,
    getAllOriginTransfersByAccountId,
    getAllDestinyTransfersByAccountId,
    getTransferById,
    createTransfer,
    updateTransfer,
    deleteTransfer
} from '../controllers/transfer.controller';

const router = Router()

/**
 * @swagger
 * /api/transfers:
 *   get:
 *     summary: Get all transfers
 *     description: Retrieve all transfers for the authenticated user (both origin and destination)
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transfers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transfer'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/transfers', getAllTransfersByUser)

/**
 * @swagger
 * /api/transfers/origin:
 *   get:
 *     summary: Get all origin transfers
 *     description: Retrieve all transfers where the authenticated user's accounts are the origin
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of origin transfers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transfer'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
//Unused
router.get('/transfers/origin', getAllOriginTransfersByUser)

/**
 * @swagger
 * /api/transfers/destiny:
 *   get:
 *     summary: Get all destination transfers
 *     description: Retrieve all transfers where the authenticated user's accounts are the destination
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of destination transfers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transfer'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
//Unused
router.get('/transfers/destiny', getAllDestinyTransfersByUser)

/**
 * @swagger
 * /api/transfers/account/{id}:
 *   get:
 *     summary: Get all transfers for an account
 *     description: Retrieve all transfers (both origin and destination) for a specific account
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID (must belong to authenticated user)
 *     responses:
 *       200:
 *         description: List of transfers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transfer'
 *       404:
 *         description: Account not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/transfers/account/:id', getAllTransfersByAccountId)

/**
 * @swagger
 * /api/transfers/account/{id}/origin:
 *   get:
 *     summary: Get origin transfers for an account
 *     description: Retrieve all transfers where the specified account is the origin
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID (must belong to authenticated user)
 *     responses:
 *       200:
 *         description: List of origin transfers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transfer'
 *       404:
 *         description: Account not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/transfers/account/:id/origin', getAllOriginTransfersByAccountId)

/**
 * @swagger
 * /api/transfers/account/{id}/destiny:
 *   get:
 *     summary: Get destination transfers for an account
 *     description: Retrieve all transfers where the specified account is the destination
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Account ID (must belong to authenticated user)
 *     responses:
 *       200:
 *         description: List of destination transfers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transfer'
 *       404:
 *         description: Account not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/transfers/account/:id/destiny', getAllDestinyTransfersByAccountId)

/**
 * @swagger
 * /api/transfer/{id}:
 *   get:
 *     summary: Get transfer by ID
 *     description: Retrieve a specific transfer by its ID (must involve authenticated user's account)
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transfer ID
 *     responses:
 *       200:
 *         description: Transfer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transfer'
 *       404:
 *         description: Transfer not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/transfer/:id', getTransferById)

/**
 * @swagger
 * /api/transfer:
 *   post:
 *     summary: Create a new transfer
 *     description: Create a transfer between two accounts. Account balances will be automatically updated
 *     tags: [Transfers]
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
 *               - originAccountId
 *               - destinyAccountId
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 500.00
 *                 description: Transfer amount from origin account
 *               destinyAmount:
 *                 type: number
 *                 format: float
 *                 example: 500.00
 *                 description: Transfer amount to destination account (for currency conversion)
 *               comment:
 *                 type: string
 *                 nullable: true
 *                 example: Transfer to savings
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: '2024-01-15T10:30:00Z'
 *                 description: Transfer date (defaults to current date if not provided)
 *               originAccountId:
 *                 type: integer
 *                 example: 1
 *                 description: Origin account ID (must belong to authenticated user)
 *               destinyAccountId:
 *                 type: integer
 *                 example: 2
 *                 description: Destination account ID (must belong to authenticated user)
 *     responses:
 *       201:
 *         description: Transfer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transfer'
 *       400:
 *         description: Bad request (missing or invalid fields)
 *       404:
 *         description: Account not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/transfer', createTransfer)

/**
 * @swagger
 * /api/transfer/{id}:
 *   patch:
 *     summary: Update a transfer
 *     description: Update an existing transfer. Account balances will be automatically adjusted
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transfer ID
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
 *                 example: 600.00
 *               destinyAmount:
 *                 type: number
 *                 format: float
 *                 example: 600.00
 *               comment:
 *                 type: string
 *                 nullable: true
 *                 example: Updated transfer comment
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: '2024-01-16T10:30:00Z'
 *               originAccountId:
 *                 type: integer
 *                 example: 1
 *               destinyAccountId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Transfer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transfer'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Transfer or account not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch('/transfer/:id', updateTransfer)

/**
 * @swagger
 * /api/transfer/{id}:
 *   delete:
 *     summary: Delete a transfer
 *     description: Delete a transfer. Account balances will be automatically adjusted
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transfer ID
 *     responses:
 *       200:
 *         description: Transfer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transfer'
 *       404:
 *         description: Transfer not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/transfer/:id', deleteTransfer)

export default router;