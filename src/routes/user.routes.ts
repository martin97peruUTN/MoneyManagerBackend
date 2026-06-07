import { Router } from 'express';

import {
    getAllUsers,
    getUserById,
    getMe
} from '../controllers/user.controller';

const router = Router()

/**
 * @swagger
 * /api/admin/user:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Retrieve all users. Only administrators can perform this action
 *     tags: [Users, Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 *       500:
 *         description: Internal server error
 */
router.get('/admin/user', getAllUsers)

/**
 * @swagger
 * /api/admin/user/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     description: Retrieve a specific user by ID. Only administrators can perform this action
 *     tags: [Users, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 *       500:
 *         description: Internal server error
 */
router.get('/admin/user/:id', getUserById)

//router.post('/user2', createUser2)

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get current authenticated user
 *     description: Retrieve the currently logged in user based on the provided JWT token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/user/me', getMe)

// Profile updates, password changes and account deletion are handled by Better
// Auth on the frontend (authClient.updateUser / changePassword / deleteUser).

export default router;