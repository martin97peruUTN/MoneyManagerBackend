import { Router } from 'express';

import {
    createUser
} from '../controllers/user.controller';

const router = Router()

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user account (no authentication required)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - name
 *               - lastname
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 example: password123
 *               name:
 *                 type: string
 *                 example: John
 *               lastname:
 *                 type: string
 *                 example: Doe
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (missing or invalid fields)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 */
router.post('/user', createUser)

export default router;