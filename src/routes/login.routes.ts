import { Router } from 'express';

import { jwtLogin } from '../controllers/login.controller';

const router = Router()

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticate user and receive JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successful login, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 */
router.post('/login', jwtLogin)

export const loginRoutes = router;